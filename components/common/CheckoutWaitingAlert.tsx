import React from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";

type CheckoutWaitingAlertProps = {
  isOpen: boolean;
};

/**
 * Checkout waiting alert component
 * - Shows a modal with backdrop
 * - Displays "Checkout is in progress" message with spinner
 * - Blocks all interactions behind the modal
 */
export function CheckoutWaitingAlert({ isOpen }: CheckoutWaitingAlertProps) {
  return (
    <Modal isOpen={isOpen} size="sm">
      <ModalBackdrop />
      <ModalContent className="p-8">
        <ModalBody>
          <VStack className="space-y-4 items-center">
            <Spinner size="large" color="purple" />
            <VStack className="space-y-2 items-center">
              <Text bold size="lg">
                Checkout in Progress
              </Text>
              <Text size="sm" className="text-gray-600 text-center">
                Please wait while we process your checkout...
              </Text>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
