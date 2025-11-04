"use client";

import * as React from "react";
import { ChatButton } from "./ChatButton";
import { ChatDrawer } from "./ChatDrawer";

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <ChatButton onClick={() => setIsOpen(true)} />
      <ChatDrawer open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

