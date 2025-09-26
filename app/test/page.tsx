export default function TestPage() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Test Page</h1>
            <p className="text-gray-600 mb-6">
               This page bypasses authentication to test if the app works.
            </p>
            <div className="space-y-4">
               <div className="p-4 bg-green-100 border border-green-300 rounded">
                  <h2 className="font-semibold text-green-800">✅ App is Working</h2>
                  <p className="text-green-700">The basic Next.js app is functioning correctly.</p>
               </div>
               <div className="p-4 bg-blue-100 border border-blue-300 rounded">
                  <h2 className="font-semibold text-blue-800">🔐 Authentication Issue</h2>
                  <p className="text-blue-700">
                     The problem is likely in the authentication flow or redirects.
                  </p>
               </div>
               <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
                  <h2 className="font-semibold text-yellow-800">📝 Next Steps</h2>
                  <p className="text-yellow-700">Check the browser console for error messages.</p>
               </div>
            </div>
            <div className="mt-6 pt-4 border-t">
               <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                  ← Back to Home
               </a>
            </div>
         </div>
      </div>
   );
}
