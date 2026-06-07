"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutModal({ open, onOpenChange, onConfirm }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50 p-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">Are you sure you want to log out?</Dialog.Title>
            <Dialog.Description className="text-gray-500 mb-8">
              You will need to sign back in to access your orders and account settings.
            </Dialog.Description>
            <div className="flex w-full gap-3">
              <Dialog.Close asChild>
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
              </Dialog.Close>
              <Button onClick={() => { onConfirm(); onOpenChange(false); }} className="flex-1 bg-red-600 text-white hover:bg-red-700">Yes, log out</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
