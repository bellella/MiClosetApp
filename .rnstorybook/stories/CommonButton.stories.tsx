import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { Button } from '@/components/common/Button';

const meta = {
  title: 'Common/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, gap: 10 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onPress: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'link'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    action: {
      control: 'select',
      options: ['primary', 'secondary', 'positive', 'negative'],
      description: 'Button action type',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default button with primary action
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Primary solid button
 */
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'solid',
    action: 'primary',
  },
};

/**
 * Secondary solid button
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'solid',
    action: 'secondary',
  },
};

/**
 * Positive action button (success)
 */
export const Positive: Story = {
  args: {
    children: 'Confirm',
    variant: 'solid',
    action: 'positive',
  },
};

/**
 * Negative action button (danger/delete)
 */
export const Negative: Story = {
  args: {
    children: 'Delete',
    variant: 'solid',
    action: 'negative',
  },
};

/**
 * Outline variant button
 */
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

/**
 * Link variant button
 */
export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
};

/**
 * Extra small button
 */
export const ExtraSmall: Story = {
  args: {
    children: 'XS Button',
    size: 'xs',
  },
};

/**
 * Small button
 */
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

/**
 * Medium button (default)
 */
export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
};

/**
 * Large button
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

/**
 * Extra large button
 */
export const ExtraLarge: Story = {
  args: {
    children: 'XL Button',
    size: 'xl',
  },
};

/**
 * Loading state button
 */
export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
};

/**
 * Loading outline button
 */
export const LoadingOutline: Story = {
  args: {
    children: 'Loading...',
    loading: true,
    variant: 'outline',
  },
};

/**
 * Disabled button
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Disabled outline button
 */
export const DisabledOutline: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'outline',
  },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    className: 'w-full',
  },
};

/**
 * Button with long text
 */
export const LongText: Story = {
  args: {
    children: 'This is a button with a very long text that might wrap',
  },
};
