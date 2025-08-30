import React, {useState, createContext, useContext, useCallback} from 'react';

const NotificationContext = createContext();


export const NotificationProvider = ({children}) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, duration = 4800) => {
        setNotification({message, duration});

        setTimeout(() => {
            setNotification(null);
        }, duration);
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{showNotification, hideNotification}}>
            {children}
            {notification && (
                <Notification
                    message={notification.message}
                    duration={notification.duration}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

const Notification = ({message, duration, onClose}) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
            <div
                className="animate-slideDown bg-gray-800 border border-blue-400 rounded-lg shadow-lg px-6 py-3 mt-4 max-w-md">
                <div className="text-white text-center">
                    {message}
                </div>
            </div>
        </div>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};