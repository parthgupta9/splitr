import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { FEATURES, TESTIMONIALS } from '@/lib/landing'
import { Icon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { STEPS } from '@/lib/landing'

const page = () => {
  return (
    <div>
      <div className="flex flex-col pt-16 items-center">
        <section className="mt-20 pb-12 space-y-10 md:space-y-20 px-5 w-full flex flex-col items-center">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Split Expenses. Simplify Life.
            </Badge>

            <h1 className="gradient-title mx-auto max-w-4xl text-4xl font-bold md:text-7xl">
              The smartest way to split expenses with friends
            </h1>

            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Manage your shared expenses effortlessly and keep your friendships strong.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Link href="/dashboard">Get Started</Link>
            </Button>

            <Button
              variant="outline"
              asChild
              size="lg"
              className="hover:bg-green-50"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* IMAGE SECTION */}
          <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl shadow-xl">
            <Image
              src="/hero.png"
              alt="Splitr Dashboard Screenshot"
              className="rounded-lg mx-auto"
              width={1200}
              height={800}
              priority
            />
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="bg-gray-50 py-20 w-full">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Features
            </Badge>

            <h2 className="gradient-title mx-auto mt-2 text-3xl md:text-4xl">
              Everything you need to manage shared expenses
            </h2>

            <p className="mx-auto max-w-2xl text-gray-500 md:text-lg/relaxed mt-4">
              From roommates to road trips, Splitr has got you covered with a suite of features designed to make expense sharing effortless.
            </p>
         <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  {FEATURES.map(({ title, Icon, bg, color, description }, idx) => (
    <Card 
      key={idx} 
      className="p-6 flex flex-col items-center text-center"
    >
      <div className={`rounded-full p-3 ${bg} mx-auto`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-gray-500">{description}</p>
      </div>
    </Card>
  ))}
</div>

          </div>
        </section>

           <section id="how-it-works" className=" py-20 w-full">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <Badge variant="outline" className="bg-green-100 text-green-800">
             How It Works
            </Badge>

            <h2 className="gradient-title mx-auto mt-2 text-3xl md:text-4xl">
             Splitting expenses made simple
            </h2>

            <p className="mx-auto max-w-2xl text-gray-500 md:text-lg/relaxed mt-4">
              Create groups, add expenses, and let Splitr handle the rest. Our intuitive platform ensures everyone stays on the same page, making expense sharing hassle-free.
            </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  {STEPS.map(({ label, title, description }, idx) => (
    <div
      key={idx}
      className="
        group
        flex flex-col items-center text-center 
        p-8 rounded-2xl border bg-white 
        shadow-sm transition-all duration-300 
        hover:shadow-lg hover:scale-[1.03]
      "
    >
      {/* Number label */}
      <div
        className="
          w-16 h-16 flex items-center justify-center
          rounded-full bg-green-100 text-green-700
          font-semibold text-xl mb-6
        "
      >
        {label}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold">{title}</h3>

      {/* Description */}
      <p className="mt-3 text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  ))}
</div>


          </div>
        </section>

            <section  className="bg-gray-50 py-20 w-full">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <Badge variant="outline" className="bg-green-100 text-green-800">
            Testemonials
            </Badge>

            <h2 className="gradient-title mx-auto mt-2 text-3xl md:text-4xl">
              What Our Users Say
            </h2>

        
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  {TESTIMONIALS.map(({ quote, name, role, image }, idx) => (
    <div
      key={idx}
      className="
        p-8 bg-white rounded-2xl border shadow-sm 
        transition-all duration-300 
        hover:shadow-lg hover:scale-[1.02]
        flex flex-col items-center text-center
      "
    >
      {/* Avatar */}
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-full object-cover mb-5 shadow-md"
      />

      {/* Quote */}
      <p className="text-gray-600 italic leading-relaxed">
        “{quote}”
      </p>

      {/* Name + role */}
      <div className="mt-6">
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  ))}
</div>
</div>
        </section>
        <section className="py-20 gradient w-full">
  <div className="container mx-auto px-4 md:px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      Ready to simplify your expenses?
    </h2>

    <p className="text-gray-600 max-w-xl mx-auto mb-8">
      Start using Splitr today and make sharing expenses effortless.
    </p>

    <Button 
      size="lg" 
      className="gradient bg-green-600 hover:bg-green-700 text-white"
      asChild
    >
      <a href="/dashboard">Get Started</a>
    </Button>
  </div>
</section>

      </div>
    </div>
  )
}

export default page
