import { logo } from "../assets"

const Navbar = () => {
    return (
         <nav className=' w-full  flex justify-between  items-center py-6 '>
          <img src={logo} alt='sumz_logo' className='w-36 object-contain' />
          <div className="flex gap-5">
          
             <button
               type='button'
               onClick={() =>
                 window.open("https://github.com/DianaMarinCalpa", "_blank")
               }
               className='black_btn'
             >
               GitHub
             </button>
            
             

          </div>
            
           </nav>
    )
}

export default Navbar