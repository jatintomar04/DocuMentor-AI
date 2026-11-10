

export default  function Footer(){
    return (
        <footer className="border-t border-[#e5e9f2] bg-white px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="font-semibold">
              Docu<span className="text-[#526df0]">Mentor</span> AI
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#8992a7]">
              A clearer way to read, understand, and work with your documents.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-[#68728a]">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQ</a>
            <a href="/signin">Sign in</a>
            <a href="#">Privacy policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-[#edf0f6] pt-5 text-xs text-[#9aa4b9]">
          © 2026 DocuMentor AI. Built to help you understand more.
        </div>
      </footer>
    )
}