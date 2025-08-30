import React, { useState, useRef, useEffect, useCallback } from 'react';
import Input from "./components/Input.jsx";
import { ArrowUpDown } from "lucide-react";
import splashes, { getRandomInt } from "./data/splashes.js";
import { getEncryptedAESKey } from "./services/encryptService.js";
import generateCompatibleRSAKeys, { decryptRSA } from "./encryption/rsa.js";
import { customEncrypt, customDecrypt} from "./encryption/custom.js";
import { useAsyncCrypto } from './hooks/useAsyncCrypto.js';
import {useNotification} from "./components/Notification.jsx";

function App() {
    const { showNotification } = useNotification();
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isEncryptMode, setIsEncryptMode] = useState(true);
    const [isAESKeyAvailable, setIsAESKeyAvailable] = useState(true);
    const [randomNumber] = useState(() => getRandomInt(0, splashes.length - 1));
    const [showOverlay, setShowOverlay] = useState(false);

    const { encrypt, decrypt } = useAsyncCrypto();
    const videoRef = useRef(null);

    const executeRequestAndSaveAESKey = async () => {
        let { privateKeyPkcs8, publicKeyBase64 } = await generateCompatibleRSAKeys();
        try {
            const encryptedAESKey = await getEncryptedAESKey(publicKeyBase64);
            const decryptedAESKey = await decryptRSA(privateKeyPkcs8, encryptedAESKey);
            localStorage.setItem('AESKey', decryptedAESKey);
        } catch (error) {
            console.error('Ошибка получения ключа AES:', error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('AESKey')) {
            setIsAESKeyAvailable(false);
            executeRequestAndSaveAESKey();
            if (localStorage.getItem('AESKey')) {
                showNotification("Обмен ключами шифрования прошел успешно. Ключ AES сохранен")
                setIsAESKeyAvailable(true);
                setTimeout(showNotification, 5100, "🎉Поздравляем, вы теперь дешїfґѧҭѻҏ!🎉")
            } else {
                showNotification("Обмен ключами шифрования провален, ошибка запроса.")
                setIsAESKeyAvailable(false);
            }

        }
    }, []);

    const handleInputChange = useCallback(async (e) => {
        if (!isAESKeyAvailable) return;

        const text = e.target.value;
        setInputText(text);

        if (!text.trim()) {
            setOutputText('');
            return;
        }

        try {
            let result;
            if (isEncryptMode) {
                result = await customEncrypt(text, encrypt, 1);
            } else {
                result = await customDecrypt(text, decrypt);
            }
            setOutputText(result);
        } catch (err) {
            console.error('Ошибка обработки:', err);
            setOutputText('Ошибка обработки');
        }
    }, [isEncryptMode, isAESKeyAvailable, encrypt, decrypt]);

    const handleSwap = useCallback(async () => {
        setIsEncryptMode(!isEncryptMode);

        setInputText(outputText);

        if (outputText.trim()) {
            try {
                let result;
                if (!isEncryptMode) {
                    result = await customEncrypt(outputText, encrypt, 1);
                } else {
                    result = await customDecrypt(outputText, decrypt);
                }
                setOutputText(result);
            } catch (err) {
                console.error('Ошибка при переключении режима:', err);
                setOutputText('Ошибка обработки');
            }
        }
    }, [isEncryptMode, outputText, encrypt, decrypt]);

    const handleVideoReady = () => {
        setTimeout(() => setShowOverlay(true), 200);
    };

    function vhToPx(vh) {
        return (vh * window.innerHeight) / 100;
    }

    return (
        <div
            className="min-h-screen bg-gray-900 text-white flex p-4 fixed-height fixed inset-0 justify-center items-center">
            <div className="hidden md:block fixed inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    onPlay={handleVideoReady}
                    onLoadedData={handleVideoReady}
                >
                    <source src="/background_video.mp4" type="video/mp4"/>
                </video>
                <div className={`absolute inset-0 bg-blue-600/40 mix-blend-multiply transition-opacity duration-1200 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>

            <div
                className={`w-full max-w-7xl bg-gray-800 my-5 rounded-2xl shadow-2xl py-6 px-4 md:max-h-[600px] md:h-5/6 flex flex-col h-[${vhToPx(100) - 30}px] z-10`}>
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 md:mb-3 text-blue-400">
                    Шїfґѧҭѻҏ 2.0
                    <span className="hidden md:inline">
                        {` | ${splashes[randomNumber]}`}
                    </span>
                </h1>

                <div className="flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col md:flex-row gap-x-6 gap-y-1">

                        <Input
                            label={isEncryptMode ? "Наш могучий" : "Шiфраторский"}
                            text={inputText}
                            haveCopy={false}
                            onClear={() => {
                                setInputText("");
                                setOutputText("");
                            }}
                            onChange={handleInputChange}
                            placeholder={isEncryptMode ? "Ваше сообщение..." : "Ваш шiфр"}
                        />

                        <div className="flex items-center justify-center py-4 md:py-0">
                            <button
                                onClick={handleSwap}
                                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl
               transition-all duration-200 ease-out
               transform hover:scale-110 active:scale-95
               shadow-lg hover:shadow-purple-500/25 active:shadow-inner
               border-2 border-transparent
               w-full flex items-center justify-center"
                                title={isEncryptMode ? 'Переключить на дешифрование' : 'Переключить на шифрование'}
                            >
                                <ArrowUpDown
                                    size={"30px"}
                                    className="transition-all duration-200 active:scale-90"
                                />
                            </button>
                        </div>


                        <Input
                            label={isEncryptMode ? "Шiфраторский" : "Наш могучий"}
                            text={outputText}
                            haveCopy={true}
                            readOnly={true}
                            placeholder={isEncryptMode ? "Ваш шiфр..." : "Ваше сообщение"}
                        />

                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>
                                Режим: {isEncryptMode ? 'Шифрование' : 'Дешифрование'}
                            </span>
                            <span className="flex items-center">
                                <div
                                    className={`w-2 h-2 rounded-full mr-2 ${isEncryptMode ? 'bg-green-400' : 'bg-blue-400'}`}/>
                                {isEncryptMode ? 'Активно' : 'Активно'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;