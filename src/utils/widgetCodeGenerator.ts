export interface WidgetConfig {
  id: string | number
  type: 'carousel' | 'product' | 'collection' | 'floating' | 'thankyou' | 'popup'
  shopDomain: string
  customization?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
    borderRadius?: number
    fontSize?: number
    showPhotos?: boolean
    showDates?: boolean
    showRatings?: boolean
    autoRotate?: boolean
    rotationSpeed?: number
  }
}

export class WidgetCodeGenerator {
  static generateEmbedCode(config: WidgetConfig): string {
    const { id, type, shopDomain, customization } = config
    
    const customizationAttrs = customization ? 
      Object.entries(customization)
        .map(([key, value]) => `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}="${value}"`)
        .join('\n     ') : ''

    return `<!-- TrustLoop Widget: ${type} -->
<div id="trustloop-widget-${id}" 
     class="trustloop-widget trustloop-${type}"
     data-widget-type="${type}" 
     data-widget-id="${id}"
     data-shop-domain="${shopDomain}"
     ${customizationAttrs}>
  <div class="trustloop-loading">
    <div class="trustloop-spinner"></div>
    <p>Loading reviews...</p>
  </div>
</div>

<script>
(function() {
  // Check if TrustLoop is already loaded
  if (window.TrustLoop) {
    window.TrustLoop.init('${id}');
    return;
  }
  
  // Load TrustLoop widget script
  var script = document.createElement('script');
  script.src = 'https://cdn.trustloop.com/widget.js?v=1.0.0';
  script.async = true;
  script.onload = function() {
    window.TrustLoop.init('${id}');
  };
  document.head.appendChild(script);
  
  // Load TrustLoop styles
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.trustloop.com/widget.css?v=1.0.0';
  document.head.appendChild(link);
})();
</script>

<style>
.trustloop-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
}

.trustloop-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: trustloop-spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes trustloop-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>`
  }

  static generateLiquidCode(config: WidgetConfig): string {
    const { id, type, customization } = config
    
    const customizationAttrs = customization ? 
      Object.entries(customization)
        .map(([key, value]) => `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}="${value}"`)
        .join('\n     ') : ''

    switch (type) {
      case 'carousel':
        return `<!-- TrustLoop Homepage Carousel Widget -->
{% comment %} Add this to your homepage template (index.liquid) {% endcomment %}
<div id="trustloop-carousel-${id}" 
     class="trustloop-carousel" 
     data-widget-id="${id}"
     data-widget-type="carousel"
     data-shop-domain="{{ shop.permanent_domain }}"
     ${customizationAttrs}>
  <div class="trustloop-loading">
    <div class="trustloop-spinner"></div>
    <p>Loading featured reviews...</p>
  </div>
</div>

{{ 'https://cdn.trustloop.com/widget.css?v=1.0.0' | stylesheet_tag }}
<script>
window.TrustLoopConfig = window.TrustLoopConfig || {};
window.TrustLoopConfig.shopDomain = '{{ shop.permanent_domain }}';
window.TrustLoopConfig.widgets = window.TrustLoopConfig.widgets || [];
window.TrustLoopConfig.widgets.push({
  id: '${id}',
  type: 'carousel',
  element: '#trustloop-carousel-${id}'
});
</script>
{{ 'https://cdn.trustloop.com/widget.js?v=1.0.0' | script_tag }}`

      case 'product':
        return `<!-- TrustLoop Product Reviews Widget -->
{% comment %} Add this to your product template (product.liquid) {% endcomment %}
<div id="trustloop-product-${id}" 
     class="trustloop-product-reviews" 
     data-widget-id="${id}"
     data-widget-type="product"
     data-product-id="{{ product.id }}"
     data-product-handle="{{ product.handle }}"
     data-shop-domain="{{ shop.permanent_domain }}"
     ${customizationAttrs}>
  <div class="trustloop-loading">
    <div class="trustloop-spinner"></div>
    <p>Loading product reviews...</p>
  </div>
</div>

{{ 'https://cdn.trustloop.com/widget.css?v=1.0.0' | stylesheet_tag }}
<script>
window.TrustLoopConfig = window.TrustLoopConfig || {};
window.TrustLoopConfig.shopDomain = '{{ shop.permanent_domain }}';
window.TrustLoopConfig.widgets = window.TrustLoopConfig.widgets || [];
window.TrustLoopConfig.widgets.push({
  id: '${id}',
  type: 'product',
  element: '#trustloop-product-${id}',
  productId: '{{ product.id }}',
  productHandle: '{{ product.handle }}'
});
</script>
{{ 'https://cdn.trustloop.com/widget.js?v=1.0.0' | script_tag }}`

      case 'collection':
        return `<!-- TrustLoop Collection Rating Snippets -->
{% comment %} Add this to your collection template (collection.liquid) {% endcomment %}
{% for product in collection.products %}
  <div class="product-item">
    <!-- Your existing product content -->
    
    <div class="trustloop-rating-snippet" 
         data-widget-id="${id}"
         data-widget-type="collection"
         data-product-id="{{ product.id }}"
         data-product-handle="{{ product.handle }}"
         data-shop-domain="{{ shop.permanent_domain }}"
         ${customizationAttrs}>
      <div class="trustloop-loading-small">
        <div class="trustloop-spinner-small"></div>
      </div>
    </div>
  </div>
{% endfor %}

{{ 'https://cdn.trustloop.com/widget.css?v=1.0.0' | stylesheet_tag }}
<script>
window.TrustLoopConfig = window.TrustLoopConfig || {};
window.TrustLoopConfig.shopDomain = '{{ shop.permanent_domain }}';
window.TrustLoopConfig.widgets = window.TrustLoopConfig.widgets || [];
window.TrustLoopConfig.widgets.push({
  id: '${id}',
  type: 'collection',
  element: '.trustloop-rating-snippet',
  multiple: true
});
</script>
{{ 'https://cdn.trustloop.com/widget.js?v=1.0.0' | script_tag }}`

      case 'floating':
        return `<!-- TrustLoop Floating Review Widget -->
{% comment %} Add this to your theme.liquid (before closing </body> tag) {% endcomment %}
<div id="trustloop-floating-${id}" 
     class="trustloop-floating-widget" 
     data-widget-id="${id}"
     data-widget-type="floating"
     data-shop-domain="{{ shop.permanent_domain }}"
     ${customizationAttrs}>
  <div class="trustloop-floating-trigger">
    <div class="trustloop-floating-icon">★</div>
    <div class="trustloop-floating-text">Reviews</div>
  </div>
  <div class="trustloop-floating-content" style="display: none;">
    <div class="trustloop-loading">
      <div class="trustloop-spinner"></div>
      <p>Loading reviews...</p>
    </div>
  </div>
</div>

{{ 'https://cdn.trustloop.com/widget.css?v=1.0.0' | stylesheet_tag }}
<script>
window.TrustLoopConfig = window.TrustLoopConfig || {};
window.TrustLoopConfig.shopDomain = '{{ shop.permanent_domain }}';
window.TrustLoopConfig.widgets = window.TrustLoopConfig.widgets || [];
window.TrustLoopConfig.widgets.push({
  id: '${id}',
  type: 'floating',
  element: '#trustloop-floating-${id}'
});
</script>
{{ 'https://cdn.trustloop.com/widget.js?v=1.0.0' | script_tag }}`

      case 'thankyou':
        return `<!-- TrustLoop Thank You Page Widget -->
{% comment %} Add this to your checkout success template (checkout/thank_you.liquid) {% endcomment %}
<div id="trustloop-thankyou-${id}" 
     class="trustloop-thankyou-widget" 
     data-widget-id="${id}"
     data-widget-type="thankyou"
     data-order-id="{{ order.id }}"
     data-order-number="{{ order.order_number }}"
     data-customer-email="{{ order.customer.email }}"
     data-customer-name="{{ order.customer.first_name }} {{ order.customer.last_name }}"
     data-shop-domain="{{ shop.permanent_domain }}"
     ${customizationAttrs}>
  <div class="trustloop-thankyou-content">
    <h3>Thank you for your purchase!</h3>
    <p>We'd love to hear about your experience. Leave a review to help other customers.</p>
    <div class="trustloop-loading">
      <div class="trustloop-spinner"></div>
      <p>Loading review form...</p>
    </div>
  </div>
</div>

{{ 'https://cdn.trustloop.com/widget.css?v=1.0.0' | stylesheet_tag }}
<script>
window.TrustLoopConfig = window.TrustLoopConfig || {};
window.TrustLoopConfig.shopDomain = '{{ shop.permanent_domain }}';
window.TrustLoopConfig.widgets = window.TrustLoopConfig.widgets || [];
window.TrustLoopConfig.widgets.push({
  id: '${id}',
  type: 'thankyou',
  element: '#trustloop-thankyou-${id}',
  order: {
    id: '{{ order.id }}',
    number: '{{ order.order_number }}',
    customer: {
      email: '{{ order.customer.email }}',
      name: '{{ order.customer.first_name }} {{ order.customer.last_name }}'
    }
  }
});
</script>
{{ 'https://cdn.trustloop.com/widget.js?v=1.0.0' | script_tag }}`

      case 'popup':
        return `<!-- TrustLoop Popup Widget -->
{% comment %} Add this to your theme.liquid (before closing </body> tag) {% endcomment %}
<div id="trustloop-popup-${id}" 
     class="trustloop-popup-widget" 
     data-widget-id="${id}"
     data-widget-type="popup"
     data-shop-domain="{{ shop.permanent_domain }}"
     ${customizationAttrs}
     style="display: none;">
  <div class="trustloop-popup-overlay">
    <div class="trustloop-popup-content">
      <div class="trustloop-popup-header">
        <h3>Customer Reviews</h3>
        <button class="trustloop-popup-close">&times;</button>
      </div>
      <div class="trustloop-popup-body">
        <div class="trustloop-loading">
          <div class="trustloop-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    </div>
  </div>
</div>

{{ 'https://cdn.trustloop.com/widget.css?v=1.0.0' | stylesheet_tag }}
<script>
window.TrustLoopConfig = window.TrustLoopConfig || {};
window.TrustLoopConfig.shopDomain = '{{ shop.permanent_domain }}';
window.TrustLoopConfig.widgets = window.TrustLoopConfig.widgets || [];
window.TrustLoopConfig.widgets.push({
  id: '${id}',
  type: 'popup',
  element: '#trustloop-popup-${id}',
  trigger: {
    type: 'scroll', // or 'time' or 'exit'
    value: 50 // 50% scroll or 5000ms time
  }
});
</script>
{{ 'https://cdn.trustloop.com/widget.js?v=1.0.0' | script_tag }}`

      default:
        return this.generateEmbedCode(config)
    }
  }

  static generateReactCode(config: WidgetConfig): string {
    const { id, type, customization } = config
    
    const customizationProps = customization ? 
      Object.entries(customization)
        .map(([key, value]) => `  ${key}={${typeof value === 'string' ? `"${value}"` : value}}`)
        .join('\n') : ''

    return `import React, { useEffect } from 'react';

// TrustLoop ${type} Widget Component
const TrustLoopWidget = () => {
  useEffect(() => {
    // Load TrustLoop widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.trustloop.com/widget.js?v=1.0.0';
    script.async = true;
    script.onload = () => {
      if (window.TrustLoop) {
        window.TrustLoop.init('${id}');
      }
    };
    document.head.appendChild(script);

    // Load TrustLoop styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.trustloop.com/widget.css?v=1.0.0';
    document.head.appendChild(link);

    // Cleanup on unmount
    return () => {
      if (window.TrustLoop && window.TrustLoop.destroy) {
        window.TrustLoop.destroy('${id}');
      }
    };
  }, []);

  return (
    <div 
      id="trustloop-widget-${id}"
      className="trustloop-widget trustloop-${type}"
      data-widget-type="${type}"
      data-widget-id="${id}"
      data-shop-domain={process.env.REACT_APP_SHOP_DOMAIN}
      ${customizationProps}
    >
      <div className="trustloop-loading">
        <div className="trustloop-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    </div>
  );
};

export default TrustLoopWidget;`
  }

  static generateInstallationInstructions(type: string): string[] {
    const baseSteps = [
      "Log in to your Shopify admin panel",
      "Navigate to Online Store → Themes",
      "Click 'Actions' → 'Edit code' for your active theme",
      "Find the appropriate template file",
      "Add the TrustLoop widget code",
      "Save the file and test the widget"
    ]

    const specificSteps = {
      carousel: [
        "Log in to your Shopify admin panel",
        "Navigate to Online Store → Themes",
        "Click 'Actions' → 'Edit code' for your active theme",
        "Find and open the 'index.liquid' file (Homepage template)",
        "Add the carousel widget code where you want reviews to appear (usually after the hero section)",
        "Save the file and visit your homepage to test",
        "Customize the widget position and styling as needed"
      ],
      product: [
        "Log in to your Shopify admin panel",
        "Navigate to Online Store → Themes",
        "Click 'Actions' → 'Edit code' for your active theme",
        "Find and open the 'product.liquid' file (Product template)",
        "Add the product reviews widget code below the product description or in a new tab",
        "Save the file and visit any product page to test",
        "Ensure the widget appears correctly on all product pages"
      ],
      collection: [
        "Log in to your Shopify admin panel",
        "Navigate to Online Store → Themes",
        "Click 'Actions' → 'Edit code' for your active theme",
        "Find and open the 'collection.liquid' file (Collection template)",
        "Add the rating snippet code within the product loop (inside the {% for product in collection.products %} loop)",
        "Save the file and visit your collection pages to test",
        "Verify that rating snippets appear for each product"
      ],
      floating: [
        "Log in to your Shopify admin panel",
        "Navigate to Online Store → Themes",
        "Click 'Actions' → 'Edit code' for your active theme",
        "Find and open the 'theme.liquid' file (Main layout template)",
        "Add the floating widget code just before the closing </body> tag",
        "Save the file and visit any page to test",
        "The floating widget should appear on all pages"
      ],
      thankyou: [
        "Log in to your Shopify admin panel",
        "Navigate to Online Store → Themes",
        "Click 'Actions' → 'Edit code' for your active theme",
        "Find and open the 'checkout/thank_you.liquid' file (Thank you page template)",
        "Add the thank you widget code at the bottom of the page content",
        "Save the file and make a test purchase to verify",
        "The widget should appear after completing a purchase"
      ],
      popup: [
        "Log in to your Shopify admin panel",
        "Navigate to Online Store → Themes",
        "Click 'Actions' → 'Edit code' for your active theme",
        "Find and open the 'theme.liquid' file (Main layout template)",
        "Add the popup widget code just before the closing </body> tag",
        "Save the file and visit any page to test",
        "Configure the popup trigger settings (scroll, time, or exit intent)"
      ]
    }

    return specificSteps[type as keyof typeof specificSteps] || baseSteps
  }

  static generateCSS(customization?: WidgetConfig['customization']): string {
    const {
      primaryColor = '#005BD3',
      backgroundColor = '#ffffff',
      textColor = '#000000',
      borderRadius = 8,
      fontSize = 14
    } = customization || {}

    return `/* TrustLoop Widget Custom Styles */
.trustloop-widget {
  background-color: ${backgroundColor};
  color: ${textColor};
  border-radius: ${borderRadius}px;
  font-size: ${fontSize}px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
}

.trustloop-widget .trustloop-star {
  color: ${primaryColor};
}

.trustloop-widget .trustloop-button {
  background-color: ${primaryColor};
  color: white;
  border: none;
  border-radius: ${borderRadius}px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: ${fontSize}px;
  transition: all 0.3s ease;
}

.trustloop-widget .trustloop-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.trustloop-widget .trustloop-review-item {
  border-left: 3px solid ${primaryColor};
  padding-left: 15px;
  margin: 15px 0;
}

.trustloop-widget .trustloop-loading {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.trustloop-widget .trustloop-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid ${primaryColor};
  border-radius: 50%;
  animation: trustloop-spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes trustloop-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .trustloop-widget {
    padding: 15px;
    font-size: ${fontSize - 1}px;
  }
  
  .trustloop-widget .trustloop-button {
    font-size: ${fontSize - 1}px;
    padding: 8px 16px;
  }
}

/* Floating Widget Specific Styles */
.trustloop-floating-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.trustloop-floating-widget:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.trustloop-floating-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: ${primaryColor};
  font-weight: 500;
  font-size: ${fontSize}px;
}

.trustloop-floating-icon {
  font-size: 18px;
  color: ${primaryColor};
}

.trustloop-floating-content {
  position: absolute;
  bottom: 100%;
  right: 0;
  width: 350px;
  max-height: 400px;
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  margin-bottom: 10px;
}

@media (max-width: 480px) {
  .trustloop-floating-content {
    width: 300px;
    right: -20px;
  }
}

/* Popup Widget Specific Styles */
.trustloop-popup-widget {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
}

.trustloop-popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.trustloop-popup-content {
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  max-width: 600px;
  max-height: 80vh;
  width: 100%;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.trustloop-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.trustloop-popup-header h3 {
  margin: 0;
  color: ${textColor};
  font-size: ${fontSize + 4}px;
}

.trustloop-popup-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.trustloop-popup-close:hover {
  background: #f5f5f5;
  color: ${textColor};
}

.trustloop-popup-body {
  padding: 20px;
}

@media (max-width: 480px) {
  .trustloop-popup-content {
    margin: 10px;
    max-height: 90vh;
  }
  
  .trustloop-popup-header,
  .trustloop-popup-body {
    padding: 15px;
  }
}`
  }
}