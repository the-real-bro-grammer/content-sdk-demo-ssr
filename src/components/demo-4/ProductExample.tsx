import { useSitecore, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { CONSTANTS } from 'lib/helpers/constants';
import { JSX } from 'react';
import { Product } from 'src/types/demo-4/product';

const Default = (props: ComponentProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const productDetails = page.layout.sitecore.context.clientData?.[
    CONSTANTS.CONTEXT.PRODUCT_DETAIL
  ] as Product;

  if (!productDetails) {
    return <></>;
  }

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
    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <article className="product-example">
          <header className="product-example__header">
            <p className="product-example__category">
              {category}
              {brand ? ` • ${brand}` : ''}
            </p>
            <h2 className="product-example__title">{name}</h2>
            {sku ? <p className="product-example__sku">SKU: {sku}</p> : null}
          </header>

          <div className="product-example__body">
            {imageUrl ? (
              <div className="product-example__media">
                <img src={imageUrl} alt={name} loading="lazy" />
              </div>
            ) : null}

            <div className="product-example__details">
              <p className="product-example__price">{priceLabel}</p>
              <p className="product-example__stock">{stockLabel}</p>
              {ratingLabel ? (
                <p className="product-example__rating" aria-label="Customer rating">
                  {ratingLabel}
                </p>
              ) : null}
              <p className="product-example__description">{description}</p>

              {tags.length ? (
                <ul className="product-example__tags">
                  {tags.map((tag) => (
                    <li key={tag} className="product-example__tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<ComponentProps>(Default);
