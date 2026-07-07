import { JobImg } from "../assets";

const About = () => {
  return (
    <div className='container mx-auto flex flex-col gap-8 py-10 2xl:gap-14'>
      <div className='flex w-full flex-col-reverse items-center gap-10 p-5 md:flex-row'>
        <div className='w-full md:w-2/3 2xl:w-2/4'>
          <h1 className='mb-5 text-3xl font-bold text-blue-600'>Hakkımızda</h1>
          <p className='leading-8 text-slate-600'>
            KariyerBul, iş arayanların kendilerine uygun ilanlara daha kolay
            ulaşmasını ve şirketlerin doğru adaylarla daha hızlı buluşmasını
            amaçlayan bir kariyer platformudur. Platformun temel amacı, iş
            arama sürecindeki dağınıklığı azaltmak ve hem adaylar hem de
            şirketler için başvuru sürecini daha anlaşılır, düzenli ve takip
            edilebilir hale getirmektir.
          </p>
        </div>
        <img src={JobImg} alt='Hakkımızda' className='h-[260px] w-auto object-contain md:h-[320px]' />
      </div>

      <div className='px-5 leading-8 text-slate-600'>
        <p>
          Adaylar ilanları inceleyebilir, ilgilendikleri pozisyonlara
          başvurabilir ve başvurularını tek yerden takip edebilir. Şirketler ise
          ilanlarını yayınlayarak gelen başvuruları görüntüleyebilir ve aday
          bilgilerine kolayca ulaşabilir. Böylece işe alım süreci daha sade,
          şeffaf ve yönetilebilir bir deneyime dönüşür.
        </p>
      </div>
    </div>
  );
};

export default About;
