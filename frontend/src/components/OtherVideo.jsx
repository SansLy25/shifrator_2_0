import React, { useRef, useState } from 'react';

export const OtherVideo = () => {
    const videoRef = useRef(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const handlePlayClick = async () => {
        if (videoRef.current) {
            try {
                videoRef.current.muted = false;
                await videoRef.current.play();
                setHasUserInteracted(true);
            } catch (error) {
                console.error('Ошибка воспроизведения:', error);
            }
        }
    };

    return (
        <div style={{ position: 'relative' }} className="bg-black flex items-center justify-center h-full">
            <video
                ref={videoRef}
                muted
                playsInline
                loop
                style={{
                    width: '100%',
                    filter: hasUserInteracted ? 'none' : 'brightness(0.7)'
                }}
            >
                <source src={"/think_something_happen_here.mp4"} type="video/mp4" />
            </video>

            {!hasUserInteracted && (
                <button
                    onClick={handlePlayClick}
                    className={"bg-blue-600 hover:bg-blue-700 rounded-xl text-white"}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '15px 30px',
                        fontSize: '18px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <span>Шiфровать</span>
                </button>
            )}
        </div>
    );
};