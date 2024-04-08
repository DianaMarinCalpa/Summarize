import { useState, useEffect } from "react";
import { archivo, copy, historia, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [copiedText, setCopiedText] = useState("");
  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles"));

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const downloadPdf = () => {
    if (getSummary) {
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      });

      const imgData = logo;
      pdf.addImage(imgData, 'PNG', 15, 10, 50, 10);

      const title = 'Resumen del Artículo';
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text(title, 105, 30, { align: 'center' });

      pdf.setFont('times', 'normal');
      pdf.setFontSize(12);
      const textLines = pdf.splitTextToSize(article.summary, pdf.internal.pageSize.width - 20);
      pdf.text(textLines, 15, 45);
      pdf.save('summary.pdf');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find((item) => item.url === article.url);

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyText = (copyText => {
    setCopiedText(copyText);
    navigator.clipboard.writeText(copyText);
    setTimeout(() => setCopiedText(false), 3000);
  });

  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <section className='mt-16 w-full max-w-3xl'>
      <div className='flex flex-col w-full gap-2'>
        <div className="flex w-full">
          <form
            className='relative flex justify-center w-full items-center dark:bg-gray-700 '
            onSubmit={handleSubmit}
          >
            <img
              src={linkIcon}
              alt title='Logo_Summarice'
              className='absolute left-0 my-2 ml-3 w-5'
            />
            <input
              type='url'
              placeholder='Pegar el enlace del artículo'
              value={article.url}
              onChange={(e) => setArticle({ ...article, url: e.target.value })}
              required
              className='url_input peer' 
            />
            <button
              type='submit'
              className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
            >
              <p>↵</p>
            </button>
          </form>
          <button onClick={() => setShowModal(true)} className='rounded-full bg-white w-6 fixed bottom-5 right-5 z-40 ' ><img
            src={historia}
            type="button"
            alt title='Historial'
          /></button>
            
        </div>
        {/* Modal */}
        {showModal && (
          <>
           <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Historial
                  </h3>
                  <button
                    className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold "
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black h-6 w-6 text-2xl block">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <div className=" flex flex-col gap-2 ">
            {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='link_card'
            >
              <div className='copy_btn ' onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt title={copied === item.url ? "Copiado" : "Copiar"}
                  className='w-8 h-8  object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm '>
                {item.url}
              </p>

              <button
              onClick={() => {
                const updatedArticles = allArticles.filter(
                  (article) => article.url !== item.url
                );
                setAllArticles(updatedArticles);
                localStorage.setItem(
                  "articles",
                  JSON.stringify(updatedArticles)
                );
              }}
              className='delete_btn'
            >
              <span className='text-red-500 text-xl'>×</span>
            </button>
            </div>

          ))}</div>
                </div>
             
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          
         


          </>

        )}
      </div>



      {/* Display Result */}



      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Bueno, se suponía que eso no iba a pasar...
            <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <div className="flex justify-between">
                <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                  Resumen del <span className='orange_gradient'>Articulo</span>
                </h2>
                <div className="flex gap-3  ">
                  
                    <div onClick={downloadPdf} className='copy_btn'><img
                    src={archivo}
                    alt title='Descargar'
                    className='w-[70%] h-[70%]'
                  /></div>
                   
                  

                  <div onClick={() => handleCopyText(article.summary)} className='copy_btn'>
                    <img
                      src={copiedText === article.summary ? tick : copy}
                      alt title={copiedText === article.summary ? "Copiado" : "Copiar"}
                      className='w-[70%] h-[70%]'
                    />
                  </div>
                </div>
              </div>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
                <br/>
                <p className='text-xs text-gray-500 fixed bottom-2 right-2'>
                  Total de Palabras: {countWords(article.summary)}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
