
function Footer() {
  return (
    <div><section className="bg-white py-12 px-4 md:px-4">
  <div className="max-w-7xl mx-auto">
    
    {/* على الدسكتوب: قسم العنوان والأيقونات بجانب الأعمدة الأربعة */}
    <div className="md:grid md:grid-cols-5 md:gap-12 lg:gap-16">
      
      {/* القسم الأول: العنوان + 3 أسطر + 4 أيقونات */}
      <div className="md:col-span-2 text-center md:text-left">
        
        {/* الـ SVG */}
        <div className="inline-block md:block py-2 ">
          <svg 
            width="166" 
            height="25" 
            viewBox="0 0 166 25" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 md:w-36 lg:w-40 h-auto"
          >
            <path d="M11.9042 24.9793C3.81939 24.9515 2.34282e-07 22.4424 0.195152 16.3648H7.13697C7.22061 17.9539 8.55879 18.9296 11.9042 18.9575C14.8594 18.9854 16.2255 18.149 16.2255 17.0618C16.2255 16.309 15.8073 15.5284 13.5212 15.1939L10.5103 14.7199C6.07758 13.9951 0.752728 13.4654 0.752728 7.47146C0.752728 2.84358 4.51636 -6.00167e-05 11.96 -6.00167e-05C18.6788 -6.00167e-05 23.3624 1.86782 23.223 8.55873H16.337C16.0582 6.99752 14.7479 6.02176 11.7927 6.02176C9.22788 6.02176 8.16849 6.80236 8.16849 7.86176C8.16849 8.53085 8.58667 9.33933 10.3709 9.61812L12.8521 10.0363C17.5079 10.8169 23.8921 10.9563 23.8921 17.3684C23.8921 22.4702 19.9333 25.0072 11.9042 24.9793ZM42.1645 0.780547H49.8869V24.1987H42.1645V15.7236H33.076V24.1987H25.3536V0.780547H33.076V9.2557H42.1645V0.780547ZM64.7014 24.9793C56.6445 24.9793 51.4311 19.989 51.4311 12.4896C51.4311 4.99024 56.6445 -6.00167e-05 64.7014 -6.00167e-05C72.7584 -6.00167e-05 77.9717 4.99024 77.9717 12.4896C77.9717 19.989 72.7584 24.9793 64.7014 24.9793ZM64.7014 18.3163C67.7681 18.3163 70.3051 16.1975 70.3051 12.4896C70.3051 8.78176 67.7681 6.66297 64.7014 6.66297C61.6348 6.66297 59.0978 8.78176 59.0978 12.4896C59.0978 16.1975 61.6348 18.3163 64.7014 18.3163ZM79.5212 24.1987V0.780547H92.8194C99.2036 0.780547 102.995 3.62418 102.995 9.92479C102.995 16.2254 99.2036 19.069 92.8473 19.069H87.2436V24.1987H79.5212ZM87.2436 12.6569H92.1503C94.0182 12.6569 95.217 11.7369 95.217 9.92479C95.217 8.11267 94.0182 7.19267 92.1782 7.19267H87.2436V12.6569ZM106.859 24.6448C104.768 24.6448 103.011 22.9163 103.011 20.8533C103.011 18.7902 104.768 17.0618 106.859 17.0618C108.949 17.0618 110.706 18.7902 110.706 20.8533C110.706 22.9163 108.949 24.6448 106.859 24.6448ZM125.39 24.9793C117.5 24.9793 112.231 19.989 112.231 12.4896C112.231 4.99024 117.5 -6.00167e-05 125.39 -6.00167e-05C131.105 -6.00167e-05 136.959 2.50903 137.74 10.4266H130.38C129.739 7.86176 127.927 6.66297 125.39 6.66297C122.323 6.66297 119.898 8.94903 119.898 12.4896C119.898 16.0302 122.323 18.3163 125.39 18.3163C127.927 18.3163 129.739 17.1175 130.38 14.4969H137.74C136.959 22.4702 131.161 24.9793 125.39 24.9793ZM152.422 24.9793C144.365 24.9793 139.151 19.989 139.151 12.4896C139.151 4.99024 144.365 -6.00167e-05 152.422 -6.00167e-05C160.479 -6.00167e-05 165.692 4.99024 165.692 12.4896C165.692 19.989 160.479 24.9793 152.422 24.9793ZM152.422 18.3163C155.488 18.3163 158.025 16.1975 158.025 12.4896C158.025 8.78176 155.488 6.66297 152.422 6.66297C149.355 6.66297 146.818 8.78176 146.818 12.4896C146.818 16.1975 149.355 18.3163 152.422 18.3163Z" fill="black"/>
          </svg>
        </div>
        
        {/* الثلاث أسطر */}
        <div className="  text-gray-700 text-sm md:text-base lg:text-lg py-2 ">
          <p className="font-medium">We have clothes that suits your style and</p>
          <p className="font-medium">which you're proud to wear. From women to men.</p>
          <p className="font-medium">Shop the latest trends with confidence.</p>
        </div>
        
        {/* الأيقونات الاجتماعية */}
        <div className="flex  md:justify-start gap-8 md:gap-6 lg:gap-8 sm:gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-5 md:w-5   " fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-5 md:w-5 " fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-5 md:w-5 " fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-5 md:w-5 " fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>
        
      </div>
      
      {/* القسم الثاني: الأعمدة الأربعة */}
      <div className="md:col-span-3 sm:py-4" >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          
          {/* العمود الأول */}
          <div className="space-y-2 md:space-y-3">
            <a href="/about" className="block hover:text-blue-600 transition-colors">
              <h3 className="font-bold text-base md:text-sm lg:text-base mb-2 md:mb-3">Company</h3>
            </a>
            <a href="/about#story" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">About</p>
            </a>
            <a href="/about#mission" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">feature</p>
            </a>
            <a href="/about#values" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">work</p>
            </a>
            <a href="/about#team" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">career</p>
            </a>
          </div>
          
          {/* العمود الثاني */}
          <div className="space-y-2 md:space-y-3">
            <a href="/about/services" className="block hover:text-blue-600 transition-colors">
              <h3 className="font-bold text-base md:text-sm lg:text-base mb-2 md:mb-3">CHELPt</h3>
            </a>
            <a href="/about/services#shipping" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Delivery Datails</p>
            </a>
            <a href="/about/services#returns" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black "> TERMS</p>
            </a>
            <a href="/about/services#warranty" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Privcy Policy</p>
            </a>
            <a href="/about/services#custom" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Custom Orders</p>
            </a>
          </div>
          
          {/* العمود الثالث */}
          <div className="space-y-2 md:space-y-3">
            <a href="/about/quality" className="block hover:text-blue-600 transition-colors">
              <h3 className="font-bold text-base md:text-sm lg:text-base mb-2 md:mb-3">F & Q</h3>
            </a>
            <a href="/about/quality#materials" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Materials Used</p>
            </a>
            <a href="/about/quality#craftsmanship" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Craftsmanship</p>
            </a>
            <a href="/about/quality#sustainability" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Sustainability</p>
            </a>
            <a href="/about/quality#testing" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Quality Testing</p>
            </a>
          </div>
          
          {/* العمود الرابع */}
          <div className="space-y-2 md:space-y-3">
            <a href="/about/connect" className="block hover:text-blue-600 transition-colors">
              <h3 className="font-bold text-base md:text-sm lg:text-base mb-2 md:mb-3">RESURCE</h3>
            </a>
            <a href="/about/connect#careers" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Connect</p>
            </a>
            <a href="/about/connect#press" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Press Inquiries</p>
            </a>
            <a href="/about/connect#partners" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Partnerships</p>
            </a>
            <a href="/about/connect#contact" className="block hover:text-blue-600 transition-colors">
              <p className="text-gray-600 hover:text-black ">Contact Us</p>
            </a>
          </div>
          
        </div>
      </div>
      
    </div>
    
   
    
  </div>
</section></div>
  )
}

export default Footer