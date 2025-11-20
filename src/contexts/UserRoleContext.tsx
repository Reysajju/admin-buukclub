'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'author' | 'reader' | null;

interface UserRoleContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    showModal: boolean;
    closeModal: () => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
    const [role, setRoleState] = useState<UserRole>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check if user has already selected a role
        const savedRole = localStorage.getItem('userRole') as UserRole;
        if (savedRole) {
            setRoleState(savedRole);
        } else {
            // Show modal for first-time visitors
            setShowModal(true);
        }
    }, []);

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        if (newRole) {
            localStorage.setItem('userRole', newRole);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <UserRoleContext.Provider value={{ role, setRole, showModal, closeModal }}>
            {children}
        </UserRoleContext.Provider>
    );
}

export function useUserRole() {
    const context = useContext(UserRoleContext);
    if (context === undefined) {
        throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    return context;
}
