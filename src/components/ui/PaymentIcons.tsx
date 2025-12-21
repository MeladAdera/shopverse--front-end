const PaymentIcons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {/* Visa */}
      <div className="flex items-center justify-center w-14 h-10 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <svg className="w-14 h-10" viewBox="0 0 40 24" fill="none">
          <path d="M16.3 9.25L15.2 13h-2.5l1.1-3.75h2.5zM29.3 9.25h1.8l1 3.75h-1.6l-.2-.8h-2.2l-.4.8h-1.7l1.9-3.75zm-2.5 2.3h1.5l-.6-1.3-.9 1.3zM11.5 9.25L10 13H8l2.9-5.2c.2-.4.6-.7 1-.7.2 0 .5.1.6.2l.2.3-1.6 2.7h1.5l.6.8h-1.6zm11.2 0l-1.1 3.75h-2.5l1.1-3.75h2.5zm6.3 0l-1.1 3.75h-2.5l1.1-3.75h2.5z" fill="#1A1F71"/>
        </svg>
      </div>
      
      {/* MasterCard */}
      <div className="flex items-center justify-center w-14 h-10 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <svg className="w-14 h-10" viewBox="0 0 40 24" fill="none">
          <circle cx="15" cy="12" r="5" fill="#EB001B"/>
          <circle cx="25" cy="12" r="5" fill="#F79E1B"/>
          <path d="M20 9.25a5 5 0 000 5.5 5 5 0 000-5.5z" fill="#FF5F00"/>
        </svg>
      </div>
      
      {/* PayPal */}
      <div className="flex items-center justify-center w-14 h-10 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <svg className="w-14 h-10" viewBox="0 0 40 24" fill="none">
          <path d="M28 9.25H18c-.7 0-1.2.5-1.2 1.2v5.1c0 .7.5 1.2 1.2 1.2h10c.7 0 1.2-.5 1.2-1.2v-5.1c0-.7-.5-1.2-1.2-1.2z" fill="#003087"/>
          <path d="M23 12.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#009CDE"/>
        </svg>
      </div>
      
      {/* Apple Pay */}
      <div className="flex items-center justify-center w-14 h-10 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <svg className="w-14 h-10" viewBox="0 0 40 24" fill="none">
          <path d="M24 9.25h-6v5.5h6v-5.5z" fill="#000"/>
          <path d="M21 10.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#666"/>
          <path d="M21 13.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="#999"/>
        </svg>
      </div>
    </div>
  );
};

export default PaymentIcons;