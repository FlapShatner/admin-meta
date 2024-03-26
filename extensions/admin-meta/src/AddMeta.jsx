import {
    reactExtension,
    useApi,
    TextField,
    Select,
    Text,
    AdminAction,
    Button,
    TextArea,
    Box,
} from '@shopify/ui-extensions-react/admin';
import { useEffect, useState, useCallback } from 'react';
import { getProducts, setMetafield } from './utils.js'
import { products, metafieldsSet } from './queries.js';


const TARGET = "admin.product-index.action.render"

export default reactExtension(TARGET, () => <App />);



function App() {
    //connect with the extension's APIs
    const { close, data } = useApi(TARGET);
    const [metafieldContent, setMetafieldContent] = useState('');
    const [allProducts, setAllProducts] = useState([])

    const options = [
        { label: 'None', value: 'None' },
        { label: 'Business (design logo)', value: 'Business (design logo)' },
        { label: 'Business (recreate logo)', value: 'Business (recreate logo)' },
        { label: 'Business (logo ready / no logo)', value: 'Business (logo ready / no logo)' },
        { label: 'Name / Text', value: 'Name / Text' }
    ]
    const [variantType, setVariantType] = useState(options[0]);

    useEffect(() => {
        getProducts(products).then((res) => {
            const products = res.data.products.edges.map(({ node }) => ({
                id: node.id,
                title: node.title,
                variants: node.variants.edges.map(({ node }) => ({
                    id: node.id,
                    title: node.title
                }))
            }))
            setAllProducts(products)
        })
    }, [])

    // console.log(allProducts)
    const onSubmit = async () => {
        allProducts.forEach((product) => {
            // console.log(product)
            product.variants.forEach((variant) => {
                // console.log(variant)
                if (variant.title.includes(variantType)) {
                    // console.log(variant.id)
                    setMetafield(metafieldsSet, variant.id, metafieldContent).then((res) => { console.log(res) })

                }
            })
        })
    };

    return (
        <AdminAction
            title="Add Ebay Description Metafield Value"
            primaryAction={
                <Button onPress={onSubmit}>GO</Button>
            }
            secondaryAction={<Button onPress={close}>Cancel</Button>}
        >
            <Select
                label="Select variant type"
                options={options}
                value={variantType}
                onChange={(val) => setVariantType(val)}
            />
            <TextField
                value={metafieldContent}
                onChange={(val) => setMetafieldContent(val)}
                label="Ebay variant description"
            />

        </AdminAction>
    );
}
