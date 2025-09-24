import heroImage from '../../assets/group-2.jpg';

export default function Hero() {
    return (
        <div>
            <div className='h-screen bg-cover bg-center'
                style={{ backgroundImage: `url(${heroImage})` }} >
                <div className='bg-black/50 h-screen'>
                    <div className='z-10 flex items-center justify-center h-full'>
                        <div className='text-white text-center px-60'>
                            <h1 className='text-5xl font-bold mb-5'>Don't go through it alone.</h1>
                            <p className='mb-10'>Our mission is to create a safe, supportive space for you to connect with others who understand
                                what you're going through. With Mental Health Support Circles, you can find your community,
                                share your story, and build meaningful connections in a completely anonymous and secure environment.</p>
                            <div>
                                <button
                                    className='px-8 py-2 rounded-full 
                                    border-2 border-neutral-50 hover:bg-neutral-50 hover:text-neutral-600'>
                                    Join a community</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}