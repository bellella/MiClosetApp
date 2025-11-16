import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';
import { Button as GluestackButton, ButtonText } from '@/components/ui/button';
import React from 'react';

// Wrapper component to test useToast hook
const ToastExample = ({
  variant = 'solid',
  action = 'muted',
  title,
  description,
}: {
  variant?: 'solid' | 'outline';
  action?: 'error' | 'warning' | 'success' | 'info' | 'muted';
  title: string;
  description?: string;
}) => {
  const toast = useToast();

  const showToast = () => {
    toast.show({
      placement: 'top',
      duration: 3000,
      render: ({ id }) => (
        <Toast key={id} variant={variant} action={action}>
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </Toast>
      ),
    });
  };

  return (
    <View style={{ padding: 16 }}>
      <GluestackButton onPress={showToast}>
        <ButtonText>Show Toast</ButtonText>
      </GluestackButton>
    </View>
  );
};

const meta = {
  title: 'UI/Toast',
  component: ToastExample,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline'],
      description: 'Toast variant style',
    },
    action: {
      control: 'select',
      options: ['error', 'warning', 'success', 'info', 'muted'],
      description: 'Toast action type',
    },
    title: {
      control: 'text',
      description: 'Toast title',
    },
    description: {
      control: 'text',
      description: 'Toast description (optional)',
    },
  },
} satisfies Meta<typeof ToastExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Success toast with solid variant
 */
export const Success: Story = {
  args: {
    variant: 'solid',
    action: 'success',
    title: 'Success!',
    description: 'Your action was completed successfully.',
  },
};

/**
 * Error toast with solid variant
 */
export const Error: Story = {
  args: {
    variant: 'solid',
    action: 'error',
    title: 'Error!',
    description: 'Something went wrong. Please try again.',
  },
};

/**
 * Warning toast with solid variant
 */
export const Warning: Story = {
  args: {
    variant: 'solid',
    action: 'warning',
    title: 'Warning!',
    description: 'Please review your input before proceeding.',
  },
};

/**
 * Info toast with solid variant
 */
export const Info: Story = {
  args: {
    variant: 'solid',
    action: 'info',
    title: 'Information',
    description: 'Here is some helpful information.',
  },
};

/**
 * Muted toast with solid variant
 */
export const Muted: Story = {
  args: {
    variant: 'solid',
    action: 'muted',
    title: 'Notice',
    description: 'This is a general notification.',
  },
};

/**
 * Success toast with outline variant
 */
export const SuccessOutline: Story = {
  args: {
    variant: 'outline',
    action: 'success',
    title: 'Success!',
    description: 'Your action was completed successfully.',
  },
};

/**
 * Error toast with outline variant
 */
export const ErrorOutline: Story = {
  args: {
    variant: 'outline',
    action: 'error',
    title: 'Error!',
    description: 'Something went wrong. Please try again.',
  },
};

/**
 * Toast with title only (no description)
 */
export const TitleOnly: Story = {
  args: {
    variant: 'solid',
    action: 'info',
    title: 'Quick notification',
  },
};

/**
 * Toast with long content
 */
export const LongContent: Story = {
  args: {
    variant: 'solid',
    action: 'info',
    title: 'Long Notification Title That Spans Multiple Lines',
    description: 'This is a very long description that demonstrates how the toast handles longer content. It should wrap properly and maintain good readability even with extensive text.',
  },
};
