import { WhatWeAreAbout, HowItWorks, OurImpactSoFar, HearFromOurCommunity } from "../../data/data"

export default function AboutUs() {
    return (
        <div className="bg-neutral-100">
            <div>
                {WhatWeAreAbout.map((item, index) => (
                    <div key={index} className="flex px-60 pt-32 gap-14">
                        <div className="flex bg-blue-500 p-14 rounded-2xl items-center justify-center w-96">
                            <h1 className="text-5xl text-neutral-50 font-bold">{item.title}</h1>
                        </div>
                        <div className="flex bg-neutral-50 p-14 rounded-2xl items-center justify-center">
                            <p className="text-lg whitespace-pre-line">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                {HowItWorks.map((item, index) => (
                    <div key={index} className="flex px-60 pt-32 gap-14">
                        <div className="flex rounded-2xl items-center justify-center">
                            <h1 className="text-5xl text-neutral-600 font-bold">{item.title}</h1>
                        </div>
                        <div className="flex bg-neutral-50 p-14 rounded-2xl items-center justify-center">
                        </div>
                    </div>
                ))}
            </div>
            <div>
                {WhatWeAreAbout.map((item, index) => (
                    <div key={index} className="flex px-60 py-32 gap-14">
                        <div className="flex bg-blue-500 p-14 rounded-2xl items-center justify-center">
                            <h1 className="text-5xl text-neutral-50 font-bold">Our Impact So Far</h1>
                        </div>
                        <div className="flex bg-neutral-50 p-14 rounded-2xl items-center justify-center">
                            <p className="text-lg whitespace-pre-line">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}