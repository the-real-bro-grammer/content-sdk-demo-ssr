import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { CONSTANTS } from 'lib/helpers/constants';
import { JSX } from 'react';
import { Product } from 'src/types/demo-4/product';

const Default = (props: ComponentProps): JSX.Element => {
    const id = props.params.RenderingIdentifier;
    const { page } = useSitecore();
    // Product data is attached server-side by the Sitecore client and surfaced via clientData.
    const productDetails = page.layout.sitecore.context.clientData?.[
        CONSTANTS.CONTEXT.PRODUCT_DETAIL
    ] as Product;

    if (!productDetails) {
        return <></>;
    }

    // Pull individual fields for readability when wiring up the view below.
    const {
        name,
        description,
        price,
        currency,
        category,
        brand,
        sku,
        imageUrl,
        tags = [],
        stock,
        rating,
        reviewCount,
    } = productDetails;

    // Prefer locale-aware formatting but fall back to a simple currency display.
    const priceLabel = (() => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
            }).format(price);
        } catch (error) {
            return `${currency} ${price.toFixed(2)}`;
        }
    })();

    const stockLabel = stock > 0 ? `${stock} in stock` : 'Currently unavailable';
    const ratingLabel =
        typeof rating === 'number' && typeof reviewCount === 'number'
            ? `${rating.toFixed(1)} out of 5 (${reviewCount} reviews)`
            : null;

    return (
        <div className={`component container mt-5 ${props.params.styles}`} id={id ? id : undefined}>
            <div className="row">
                <div className="col-md-6 mb-4">
                    {imageUrl ? (
                        <div className="product-example__media">
                            <img
                                src={imageUrl}
                                alt={name}
                                loading="lazy"
                                className="img-fluid rounded mb-3 product-image"
                            />
                        </div>
                    ) : null}
                </div>
                <div className="col-md-6">
                    <h2 className="mb-3">{name}</h2>
                    <p className="product-example__category">
                        {category}
                        {brand ? ` - ${brand}` : ''}
                    </p>
                    <p className="text-muted mb-4">SKU: {sku}</p>
                    <div className="mb-3">
                        <span className="h4 me-2">{priceLabel}</span>
                        <span className="text-muted">({stockLabel})</span>
                    </div>
                    {ratingLabel ? (
                        <p className="product-example__rating" aria-label="Customer rating">
                            {ratingLabel}
                        </p>
                    ) : null}
                    <p className="mb-4">{description}</p>
                    {tags.length ? (
                        <ul className="list-group list-group-horizontal">
                            {tags.map((tag) => (
                                <li key={tag} className="">
                                    #{tag}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                    <div className="mb-4">
                        <label htmlFor="quantity" className="form-label">
                            Quantity:
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            value="1"
                            min="1"
                            style={{ width: '80px' }}
                        ></input>
                    </div>
                    <button className="btn btn-primary btn-lg mb-3 me-2">
                        <i className="bi bi-cart-plus"></i> Add to Cart
                    </button>
                    <button className="btn btn-outline-secondary btn-lg mb-3">
                        <i className="bi bi-heart"></i> Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Default;
