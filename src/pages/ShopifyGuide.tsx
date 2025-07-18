import React from 'react'
import ShopifyConnectionGuide from '@/components/onboarding/ShopifyConnectionGuide'

export default function ShopifyGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <ShopifyConnectionGuide />
      </div>
    </div>
  )
}