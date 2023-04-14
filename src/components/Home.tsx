import { Link } from "wouter";

export default function Home() {
    return (
        <div className="flex justify-center flex-col items-center min-h-screen  bg-gradient-to-r from-blue-400 to-emerald-400">
            {/* <h1 className='text-6xl mb-20 tracking-wider font	'>
                Ideas para aprender
            </h1> */}
            <div className="flex gap-5">
                <Link href="/memory">
                    <div className="bg-white rounded-lg p-5 hover:text-white hover:bg-green-500 cursor-pointer">
                        Memory
                    </div>
                </Link>
                <Link href="/crucigrama">
                    <div className="bg-white rounded-lg p-5 hover:text-white hover:bg-green-500 cursor-pointer">
                        Crucigrama
                    </div>
                </Link>
            </div>
        </div>
    )
}