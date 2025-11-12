import { AppContainer } from "@/components/app/app-container";
import { ProductCollectionGrid } from "@/components/products/product-collection/Grid";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";


export default function WishlistScreen() {
    useAuthGuard();
    return (
        <AppContainer headerTitle="찜한 상품" showHeaderLogo={true} showHeaderCart={true}>
            <ProductCollectionGrid products={[]}/>
        </AppContainer>
    );
}
