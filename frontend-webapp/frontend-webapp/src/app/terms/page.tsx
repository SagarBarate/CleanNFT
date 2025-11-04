export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
          Terms & <span className="text-[#00A86B]">Conditions</span>
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using CleanNFT, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p>
              CleanNFT provides a blockchain-based recycling rewards platform that mints NFTs for verified 
              recycling activities. Users can claim, trade, and display these NFTs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate information when using our services</li>
              <li>Maintain the security of your wallet and account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in fraudulent or illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. NFT Ownership</h2>
            <p>
              NFTs minted through CleanNFT are ERC-721 standard tokens. Ownership of NFTs is recorded on 
              the blockchain and is immutable. You own the NFT once it's minted to your wallet address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Risk Disclosure</h2>
            <p className="text-red-600 font-semibold">
              ⚠️ Risk Disclosure: Cryptocurrency and blockchain assets involve substantial risk. The value of 
              NFTs can be volatile and may decrease in value. Past performance is not indicative of future results. 
              Only invest what you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p>
              CleanNFT shall not be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including but not limited to loss of profits, data, or use, incurred by you or any third 
              party, whether in an action in contract or tort, arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material 
              changes via email or through the platform. Continued use of the service after changes constitutes 
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
            <p>
              For questions about these Terms & Conditions, please contact us at{" "}
              <a href="mailto:legal@cleannft.com" className="text-[#00A86B] hover:underline">
                legal@cleannft.com
              </a>
            </p>
          </section>

          <section>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

