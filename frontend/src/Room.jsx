import React, { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from './SocketContext';
import { useParams } from 'react-router-dom';

const Room = () => {
    const [otherUser, setOtherUser] = useState(null);
    const [myVideo, setMyVideo] = useState(null);
    const { socket } = useContext(SocketContext);
    const { room } = useParams();
    const peerConnection = useRef(null);
    const myVideoRef = useRef(null);
    const remoteVideo = useRef(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const iceServers = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    };

    const handleTrackEvent = (event) => {
        if (event.streams && event.streams[0]) {
            remoteVideo.current.srcObject = event.streams[0];
            setRemoteStream(event.streams[0]);
            console.log('Received remote stream:', event.streams[0]);
        }
    };

    const callUser = async () => {
        console.log('Calling user...');
     
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyVideo(stream);
        myVideoRef.current.srcObject = stream;

        peerConnection.current = new RTCPeerConnection(iceServers);
        peerConnection.current.ontrack = handleTrackEvent;
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Sending ICE candidate:', event.candidate);
                socket.emit('ice-candidate', { candidate: event.candidate, room });
            }
        };

        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        console.log('Sending offer:', peerConnection.current.localDescription);
        socket.emit('call-user', { offer: peerConnection.current.localDescription, room });
    };

    const handleIncomingCall = async (data) => {
        console.log('Received incoming call:', data);
        if (!peerConnection.current) {
            peerConnection.current = new RTCPeerConnection(iceServers);
            peerConnection.current.ontrack = handleTrackEvent;
            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate:', event.candidate);
                    socket.emit('ice-candidate', { candidate: event.candidate, room });
                }
            };
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyVideo(stream);
        myVideoRef.current.srcObject = stream;
            if (stream) {
                stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
            }
        }

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        console.log('Sending answer:', peerConnection.current.localDescription);
        socket.emit('answer', { answer: peerConnection.current.localDescription, room });
    };

    const handleIceCandidate = async (data) => {
        console.log('Received ICE candidate:', data);
        if (data.candidate && peerConnection.current) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    }

    useEffect(() => {
        socket.emit('join:room', room);
        socket.on('user:connection', (data) => {
            setOtherUser(data);
            console.log('User connected:', data);
        });
        socket.on('incoming-call', handleIncomingCall);
        socket.on('answered', async (data) => {
            console.log('Received answer:', data);
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        });
        socket.on('ice-candidate', handleIceCandidate);

        return () => {
            socket.off('join:room');
            socket.off('user:connection');
            socket.off('incoming-call');
            socket.off('answered');
            socket.off('ice-candidate');
        };
    }, [socket]);

    return (
        <div className='flex items-center flex-col gap-10'>
            <div>
                {otherUser ? (
                    <div>
                        <button className='px-3 py-1 rounded-md outline-none bg-green-600 text-white text-xl font-bold' onClick={callUser}>
                            Call
                        </button>
                    </div>
                ) : (
                    <div className='text-4xl font-bold '>No One in this Room</div>
                )}
            </div>
            <div>
              <div>My Stream</div>
                <video ref={myVideoRef} autoPlay className='w-[30%] h-[30%]'></video>
            </div>
            <div>
              <div>Remote Stream</div>
                <video ref={remoteVideo} autoPlay className='w-[30%] h-[30%]'></video>
            </div>
        </div>
    );
};

export default Room;
