import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text, ScrollView } from 'react-native';
import { fn } from 'storybook/test';
import { FloatingButton } from '@/components/common/FloatingButton';
import { ButtonText } from '@/components/ui/button';

const meta = {
  title: 'Common/FloatingButton',
  component: FloatingButton,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            Scroll down to see the floating button at the bottom
          </Text>
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={{
                padding: 16,
                backgroundColor: 'white',
                marginBottom: 8,
                borderRadius: 8,
              }}
            >
              <Text>Content Item {i + 1}</Text>
            </View>
          ))}
        </ScrollView>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onPress: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content',
    },
    onPress: {
      description: 'Function called when button is pressed',
    },
  },
} satisfies Meta<typeof FloatingButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default floating button with text
 */
export const Default: Story = {
  args: {
    children: <ButtonText>Continue</ButtonText>,
  },
};

/**
 * Floating button for adding items
 */
export const AddItem: Story = {
  args: {
    children: <ButtonText>Add to Cart</ButtonText>,
  },
};

/**
 * Floating button for checkout
 */
export const Checkout: Story = {
  args: {
    children: <ButtonText>Proceed to Checkout</ButtonText>,
  },
};

/**
 * Floating button for confirmation
 */
export const Confirm: Story = {
  args: {
    children: <ButtonText>Confirm Selection</ButtonText>,
  },
};

/**
 * Floating button for saving
 */
export const Save: Story = {
  args: {
    children: <ButtonText>Save Changes</ButtonText>,
  },
};

/**
 * Floating button with long text
 */
export const LongText: Story = {
  args: {
    children: <ButtonText>Continue with this very long action text</ButtonText>,
  },
};

/**
 * Floating button for submit
 */
export const Submit: Story = {
  args: {
    children: <ButtonText>Submit Form</ButtonText>,
  },
};

/**
 * Floating button for next step
 */
export const NextStep: Story = {
  args: {
    children: <ButtonText>Next Step →</ButtonText>,
  },
};
