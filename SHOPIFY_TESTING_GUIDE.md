# TrustLoop Shopify App Testing Guide

## Overview

This guide will help you test the TrustLoop Shopify Review & UGC Management app on a real Shopify store. All mock data has been removed and the app now uses Blink's database to store real data.

## Prerequisites

1. **Shopify Store**: You need access to a Shopify store (development store or live store)
2. **Blink Account**: Sign up at [blink.new](https://blink.new) to access the app
3. **Shopify Partner Account**: Optional but recommended for creating development stores

## Testing Setup

### 1. Create a Shopify Development Store

If you don't have a Shopify store, create a development store:

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Create a partner account if you don't have one
3. Click "Stores" → "Add store" → "Development store"
4. Fill in the store details and create the store
5. Note down your store domain (e.g., `your-test-store.myshopify.com`)

### 2. Access the TrustLoop App

1. Visit the app at: `https://trustloop-shopify-review-app-ajm7ka08.sites.blink.new`
2. Sign in with your Google account (handled by Blink Auth)
3. You'll be redirected to the dashboard

### 3. Connect Your Shopify Store

Since this is a development version, the app will simulate the connection process:

1. Click "Connect Shopify Store" or go through the onboarding flow
2. Enter your Shopify store domain (e.g., `your-test-store.myshopify.com`)
3. Choose "Private App" connection method (for testing)
4. The app will simulate the connection process

**Note**: In production, you would need to create a real Shopify app and configure OAuth properly.

## Testing Features

### 1. Dashboard Analytics

**What to Test:**
- Dashboard loads without errors
- Analytics cards show zeros (no data yet)
- Charts render properly
- No mock data is displayed

**Expected Behavior:**
- All analytics show 0 values initially
- Loading states work correctly
- Error handling for missing data

### 2. Review Management

**Test Cases:**

#### A. Create New Reviews (Simulated)
Since there's no real order data, you can test by:
1. Go to Reviews page
2. Look for "Add Review" functionality (if implemented)
3. Create test reviews with different ratings and content

#### B. Review Moderation
1. Navigate to Reviews → Moderation Queue
2. Test approve/reject/flag actions
3. Verify status changes persist in database
4. Test reply functionality

#### C. Review Filtering
1. Test search functionality
2. Test filtering by rating, product, status
3. Verify pagination works

### 3. Widget Configuration

**Test Cases:**
1. Go to Widgets page
2. Create different widget types:
   - Homepage Carousel
   - Product Page Reviews
   - Floating Widget
   - Collection Page Snippets
3. Test widget customization options
4. Verify widget code generation
5. Test widget preview functionality

### 4. Email Templates

**Test Cases:**
1. Navigate to Email Templates
2. Create new templates:
   - Post-purchase review request
   - Follow-up reminders
   - Thank you messages
3. Test template editor
4. Verify template variables work
5. Test template preview

### 5. Campaign Management

**Test Cases:**
1. Go to Campaigns page
2. Create automated campaigns
3. Test campaign scheduling
4. Verify campaign analytics
5. Test campaign pause/resume functionality

### 6. Instagram UGC

**Test Cases:**
1. Navigate to Instagram UGC page
2. Since real Instagram API isn't connected, test the UI
3. Test UGC approval/rejection flow
4. Test product assignment functionality

### 7. Settings

**Test Cases:**
1. Go to Settings page
2. Test different configuration options
3. Verify settings are saved to database
4. Test moderation settings
5. Test notification preferences

## Database Testing

### Verify Data Persistence

1. **Create Test Data**: Add reviews, templates, widgets, etc.
2. **Refresh Page**: Ensure data persists after page reload
3. **Clear Browser Cache**: Verify data still exists
4. **Different Browser**: Log in from different browser and check data

### Test User Isolation

1. **Multiple Users**: Have different people sign in
2. **Data Separation**: Verify users only see their own data
3. **Shop Isolation**: If multiple shops, verify data separation

## Performance Testing

### Load Testing
1. Create multiple reviews (10-20)
2. Test dashboard loading time
3. Test search and filtering performance
4. Verify pagination works with more data

### Error Handling
1. Test with network disconnection
2. Test with invalid data inputs
3. Test concurrent user actions
4. Verify error messages are user-friendly

## Integration Testing

### Shopify Integration Points

**Note**: These are simulated in the current version but should be tested in production:

1. **Product Sync**: Verify products from Shopify appear in the app
2. **Order Webhooks**: Test order fulfillment triggers
3. **Customer Data**: Verify customer information is imported
4. **Widget Installation**: Test widget code installation on Shopify theme

### Email Integration

1. **SMTP Configuration**: Test email sending (if implemented)
2. **Template Rendering**: Verify email templates render correctly
3. **Campaign Delivery**: Test automated email campaigns

## Security Testing

### Authentication
1. Test unauthorized access attempts
2. Verify user data isolation
3. Test session management
4. Verify API endpoint security

### Data Protection
1. Test input validation
2. Verify XSS protection
3. Test SQL injection prevention
4. Verify sensitive data encryption

## Browser Compatibility

Test the app on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Mobile Responsiveness

Test on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)
- Large Mobile (414x896)

## Common Issues and Solutions

### Issue: Dashboard shows no data
**Solution**: This is expected for a new installation. Start by connecting a Shopify store and creating test data.

### Issue: Shopify connection fails
**Solution**: Verify the store domain format is correct (e.g., `store.myshopify.com`). The current version simulates the connection.

### Issue: Database errors
**Solution**: Check browser console for errors. Ensure you're signed in with Blink Auth.

### Issue: Widget code not working
**Solution**: Widget installation requires manual integration with Shopify theme in a real environment.

## Testing Checklist

- [ ] User authentication works
- [ ] Shopify store connection works
- [ ] Dashboard loads and shows correct data
- [ ] Review creation and moderation works
- [ ] Widget configuration works
- [ ] Email template creation works
- [ ] Campaign management works
- [ ] Instagram UGC interface works
- [ ] Settings are saved and loaded
- [ ] Data persists across sessions
- [ ] Mobile responsiveness works
- [ ] Error handling works properly
- [ ] Performance is acceptable
- [ ] Security measures are effective

## Production Deployment Notes

Before using with a real Shopify store:

1. **Shopify App Setup**: Create a real Shopify app in Partner Dashboard
2. **OAuth Configuration**: Implement proper OAuth flow
3. **Webhook Setup**: Configure real Shopify webhooks
4. **API Integration**: Connect to real Shopify Admin API
5. **Email Service**: Set up transactional email service
6. **Instagram API**: Configure Instagram Basic Display API
7. **Domain Setup**: Configure proper domains for production

## Support

If you encounter issues during testing:
1. Check browser console for JavaScript errors
2. Verify network connectivity
3. Ensure you're using a supported browser
4. Contact support with detailed error descriptions

## Feedback

Please provide feedback on:
- User experience and interface
- Performance issues
- Missing features
- Bug reports
- Suggestions for improvement

This testing guide ensures comprehensive coverage of the TrustLoop app functionality while working with real Shopify stores.