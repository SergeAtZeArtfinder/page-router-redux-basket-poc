"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const StyledModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledModalBody = styled.div`
  position: relative;
  z-index: 100;
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledCloseButton = styled.button`
  position: absolute;
  padding: 0;
  top: 0;
  background-color: transparent;
  color: #333;
  right: 0;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 100%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #eaeaea;
  }
  &:active {
    background-color: #d2d0d0;
  }
`;

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: Props): JSX.Element | null => {
  const [mounted, setMounted] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <StyledModalOverlay onClick={handleOverlayClick}>
      <StyledModalBody>
        <StyledCloseButton onClick={onClose}>ⓧ</StyledCloseButton>
        {children}
      </StyledModalBody>
    </StyledModalOverlay>,
    document.body
  );
};

export default Modal;
