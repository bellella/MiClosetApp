import { AppContainer } from "@/components/app/app-container";
import { ProductListGrid } from "@/components/products/product-list/Grid";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";


export default function WishlistScreen() {
    useAuthGuard();
    return (
        <AppContainer headerTitle="찜한 상품" showHeaderLogo={true} showHeaderCart={true}>
            <ProductListGrid products={[]}/>
        </AppContainer>
    );
}
