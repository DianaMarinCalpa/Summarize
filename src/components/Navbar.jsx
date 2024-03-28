import { logo } from "../assets"

const Navbar = () => {
    return (
         <nav className=' w-full  flex justify-between  items-center py-6 '>
             <img src={logo} alt='sumz_logo' className='w-36 object-contain' />
             <button
               type='button'
               onClick={() =>
                 window.open("https://github.com/ingdemc", "_blank")
               }
               className='black_btn'
             >
               GitHub
             </button>
           </nav>
    )
}

export default Navbar