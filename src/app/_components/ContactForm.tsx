const ContactForm = () => {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <form className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="cursor-pointer text-sm font-medium text-gray-700">
              Voornaam
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Joris"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="cursor-pointer text-sm font-medium text-gray-700">
              Achternaam
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="van Dijk"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="email" className="cursor-pointer text-sm font-medium text-gray-700">
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="naam@bedrijf.nl"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="cursor-pointer text-sm font-medium text-gray-700">
              Telefoonnummer
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="06 12345678"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="cursor-pointer text-sm font-medium text-gray-700">
            Bedrijf
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Visma Verzuim"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="cursor-pointer text-sm font-medium text-gray-700">
            Bericht
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Vertel ons meer over je vraag"
            required
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 bg-white text-orange-500 accent-orange-500 focus:ring-orange-400 dark:bg-white"
          />
          Ik ga akkoord met het verwerken van mijn gegevens volgens het privacybeleid.
        </label>

        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 md:w-auto"
        >
          Verstuur bericht
        </button>
      </form>
    </section>
  )
}

export { ContactForm }
