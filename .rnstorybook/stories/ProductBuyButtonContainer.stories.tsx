import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductBuyButtonContainer } from '../../components/products/product-buy-button-container';
import type { ProductOption } from '../../lib/graphql/shopify.schema';
import type { ProductVariantFragment } from '../../lib/graphql/products/products.graphql';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock data for product options and variants
const mockOptionsSimple: Pick<ProductOption, "name" | "values">[] = [
  {
    name: "Size",
    values: ["S", "M", "L", "XL"],
  },
  {
    name: "Color",
    values: ["Black", "White", "Blue"],
  },
];

const mockOptionsComplex: Pick<ProductOption, "name" | "values">[] = [
  {
    name: "Size",
    values: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Color",
    values: ["Black", "White", "Blue", "Red", "Green"],
  },
  {
    name: "Material",
    values: ["Cotton", "Polyester", "Blend"],
  },
];

const mockVariantsSimple: ProductVariantFragment[] = [
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/1",
    title: "S / Black",
    availableForSale: true,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "S" },
      { __typename: "SelectedOption", name: "Color", value: "Black" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "29000",
      currencyCode: "KRW" as const,
    },
  },
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/2",
    title: "S / White",
    availableForSale: true,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "S" },
      { __typename: "SelectedOption", name: "Color", value: "White" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "29000",
      currencyCode: "KRW" as const,
    },
  },
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/3",
    title: "M / Black",
    availableForSale: true,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "M" },
      { __typename: "SelectedOption", name: "Color", value: "Black" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "31000",
      currencyCode: "KRW" as const,
    },
  },
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/4",
    title: "M / White",
    availableForSale: false,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "M" },
      { __typename: "SelectedOption", name: "Color", value: "White" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "31000",
      currencyCode: "KRW" as const,
    },
  },
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/5",
    title: "L / Black",
    availableForSale: true,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "L" },
      { __typename: "SelectedOption", name: "Color", value: "Black" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "33000",
      currencyCode: "KRW" as const,
    },
  },
];

const mockVariantsComplex: ProductVariantFragment[] = [
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/1",
    title: "S / Black / Cotton",
    availableForSale: true,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "S" },
      { __typename: "SelectedOption", name: "Color", value: "Black" },
      { __typename: "SelectedOption", name: "Material", value: "Cotton" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "45000",
      currencyCode: "KRW" as const,
    },
  },
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/2",
    title: "M / Blue / Polyester",
    availableForSale: true,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "M" },
      { __typename: "SelectedOption", name: "Color", value: "Blue" },
      { __typename: "SelectedOption", name: "Material", value: "Polyester" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "39000",
      currencyCode: "KRW" as const,
    },
  },
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/3",
    title: "L / Red / Blend",
    availableForSale: false,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Size", value: "L" },
      { __typename: "SelectedOption", name: "Color", value: "Red" },
      { __typename: "SelectedOption", name: "Material", value: "Blend" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "42000",
      currencyCode: "KRW" as const,
    },
  },
];

const mockVariantsSingleOption: ProductVariantFragment[] = [
  {
    __typename: "ProductVariant",
    id: "gid://shopify/ProductVariant/1",
    title: "Default",
    availableForSale: true,
    selectedOptions: [
      { __typename: "SelectedOption", name: "Title", value: "Default Title" },
    ],
    price: {
      __typename: "MoneyV2",
      amount: "25000",
      currencyCode: "KRW" as const,
    },
  },
];

const meta = {
  title: 'Products/ProductBuyButtonContainer',
  component: ProductBuyButtonContainer,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <Story />
        </View>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: 'Product options with names and values',
    },
    variants: {
      description: 'Available product variants with pricing and availability',
    },
  },
} satisfies Meta<typeof ProductBuyButtonContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic product with simple options (Size and Color)
 * Includes 5 variants with different pricing
 */
export const Default: Story = {
  args: {
    options: mockOptionsSimple,
    variants: mockVariantsSimple,
  },
};

/**
 * Product with multiple option types (Size, Color, and Material)
 * Demonstrates handling of more complex variant combinations
 */
export const ComplexOptions: Story = {
  args: {
    options: mockOptionsComplex,
    variants: mockVariantsComplex,
  },
};

/**
 * Product with limited variants
 * Good for testing edge cases with fewer options
 */
export const LimitedVariants: Story = {
  args: {
    options: [
      {
        name: "Size",
        values: ["S", "M"],
      },
    ],
    variants: [
      {
        __typename: "ProductVariant",
        id: "gid://shopify/ProductVariant/1",
        title: "S",
        availableForSale: true,
        selectedOptions: [
          { __typename: "SelectedOption", name: "Size", value: "S" },
        ],
        price: {
          __typename: "MoneyV2",
          amount: "19900",
          currencyCode: "KRW" as const,
        },
      },
      {
        __typename: "ProductVariant",
        id: "gid://shopify/ProductVariant/2",
        title: "M",
        availableForSale: true,
        selectedOptions: [
          { __typename: "SelectedOption", name: "Size", value: "M" },
        ],
        price: {
          __typename: "MoneyV2",
          amount: "19900",
          currencyCode: "KRW" as const,
        },
      },
    ],
  },
};

/**
 * Product with single variant (no options to select)
 * Useful for simple products without variations
 */
export const SingleVariant: Story = {
  args: {
    options: [],
    variants: mockVariantsSingleOption,
  },
};

/**
 * Premium product with higher pricing
 * Tests UI with larger price values
 */
export const PremiumProduct: Story = {
  args: {
    options: mockOptionsSimple,
    variants: [
      {
        __typename: "ProductVariant",
        id: "gid://shopify/ProductVariant/1",
        title: "S / Black",
        availableForSale: true,
        selectedOptions: [
          { __typename: "SelectedOption", name: "Size", value: "S" },
          { __typename: "SelectedOption", name: "Color", value: "Black" },
        ],
        price: {
          __typename: "MoneyV2",
          amount: "189000",
          currencyCode: "KRW" as const,
        },
      },
      {
        __typename: "ProductVariant",
        id: "gid://shopify/ProductVariant/2",
        title: "M / White",
        availableForSale: true,
        selectedOptions: [
          { __typename: "SelectedOption", name: "Size", value: "M" },
          { __typename: "SelectedOption", name: "Color", value: "White" },
        ],
        price: {
          __typename: "MoneyV2",
          amount: "199000",
          currencyCode: "KRW" as const,
        },
      },
    ],
  },
};

/**
 * Product with mostly out of stock variants
 * Tests availability UI states
 */
export const MostlyOutOfStock: Story = {
  args: {
    options: mockOptionsSimple,
    variants: mockVariantsSimple.map((variant, index) => ({
      ...variant,
      availableForSale: index === 0, // Only first variant available
    })),
  },
};
