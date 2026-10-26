import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { categories, dishes, menuUrl } from './menu';
import type { Dish } from './menu';
import { gallery } from './photos';

const mapUrl = 'https://yandex.com/maps/org/hmel_i_sol/72053749432/';
const galleryUrl = 'https://yandex.com/maps/org/hmel_i_sol/72053749432/gallery/';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Меню', '#menu'], ['Атмосфера', '#atmosphere'], ['Контакты', '#contacts']];
  return <header className="header">
    <a className="brand" href="#top" aria-label="Хмель и Соль — наверх"><span className="brand-mark">Х<span>+</span>С</span><span className="brand-caption">САЛЕХАРД · РЕСТОРАН</span></a>
    <button className="menu-toggle" type="button" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Закрыть' : 'Меню'}<span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    <nav className={open ? 'nav nav-open' : 'nav'} aria-label="Основная навигация">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-book" href="tel:+73492237340">Позвонить <Arrow diagonal /></a></nav>
  </header>;
}

function Hero() {
  const photoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const photo = photoRef.current;
    if (!photo) return;
    let inView = false;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0 });
    observer.observe(photo);
    const onScroll = () => {
      if (!inView || frame) return;
      frame = requestAnimationFrame(() => { photo.style.setProperty('--parallax', `${Math.min(window.scrollY * .12, 80)}px`); frame = 0; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-photo" ref={photoRef} aria-hidden="true" />
    <div className="hero-shade" />
    <div className="hero-content wrap">
      <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> ВСТРЕЧАЕМСЯ В САЛЕХАРДЕ</p>
      <h1 id="hero-title">Хмель<span className="hero-amp">&</span><br />Соль<span className="period">.</span></h1>
      <div className="hero-bottom"><p>Место для<br />вашего вечера.</p><div className="hero-actions"><a className="button button-light" href="#menu">Смотреть меню <Arrow /></a><a className="button button-outline" href={mapUrl} target="_blank" rel="noreferrer">На карте <Arrow diagonal /></a></div></div>
    </div>
    <div className="hero-edge"><span>66°32′ С. Ш.</span><span>ЛИСТАЙТЕ ВНИЗ ↓</span></div>
  </section>;
}

function Modal({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !ref.current) return;
      const focusables = [...ref.current.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter(el => !el.hasAttribute('disabled'));
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', key); previous?.focus(); };
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} ref={ref}>{children}</div></div>;
}

function DishCard({ dish, onOpen }: { dish: Dish; onOpen: () => void }) {
  return <button type="button" className="dish-card" onClick={onOpen} aria-label={`Подробнее: ${dish.name}`}>
    <span className="dish-image"><img src={dish.imageUrl} alt={dish.name} loading="lazy" /></span>
    <span className="dish-row"><span><span className="dish-category">{categories.find(c => c.id === dish.categoryId)?.label}</span><strong>{dish.name}</strong>{dish.portion && <small>{dish.portion}</small>}</span><span className="dish-price">{dish.priceRub.toLocaleString('ru-RU')} ₽</span></span>
  </button>;
}

function MenuSection() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Dish | null>(null);
  const found = dishes.filter(dish => (category === 'all' || dish.categoryId === category) && dish.name.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')));
  return <section className="menu-section section" id="menu" aria-labelledby="menu-title">
    <div className="wrap"><div className="section-heading reveal"><div><p className="eyebrow"><span className="eyebrow-line" /> ВКУС МОМЕНТА</p><h2 id="menu-title">Меню<span className="period">.</span></h2></div><p className="section-intro">Выбирайте то, что по душе. Актуальные позиции и цены — в карточке ресторана.</p></div>
      <div className="menu-toolbar reveal"><div className="category-list" role="group" aria-label="Категории меню"><button className={category === 'all' ? 'category active' : 'category'} type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>Всё меню</button>{categories.map(item => <button key={item.id} className={category === item.id ? 'category active' : 'category'} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><span className="sr-only">Поиск блюд по названию</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Найти блюдо" type="search" /></label></div>
      {found.length ? <div className="dish-grid">{found.map(dish => <DishCard key={dish.id} dish={dish} onOpen={() => setSelected(dish)} />)}</div> : <div className="menu-empty reveal"><div className="empty-glyph" aria-hidden="true">Х<span>+</span>С</div><div><p className="eyebrow">{query ? 'ПОИСК' : 'МЕНЮ РЕСТОРАНА'}</p><h3>{query ? 'Ничего не найдено' : 'Всё самое вкусное — по ссылке'}</h3><p>{query ? 'Попробуйте другое название или посмотрите актуальное меню ресторана.' : 'Проверенные названия блюд и цены пока не опубликованы в доступном источнике. Откройте меню ресторана в Яндекс Картах.'}</p><a className="text-link" href={menuUrl} target="_blank" rel="noreferrer">Открыть меню в Яндекс Картах <Arrow diagonal /></a></div></div>}
      <div className="menu-note"><span>Актуальное меню и наличие уточняйте в ресторане.</span><a href="tel:+73492237340">+7 (34922) 3-73-40 <Arrow diagonal /></a></div>
    </div>
    {selected && <Modal label={selected.name} onClose={() => setSelected(null)}><button className="modal-close" type="button" aria-label="Закрыть" onClick={() => setSelected(null)}>×</button><img className="dish-modal-image" src={selected.imageUrl} alt={selected.name} /><div className="dish-modal-body"><p className="eyebrow">{categories.find(c => c.id === selected.categoryId)?.label}</p><h3>{selected.name}</h3>{selected.description && <p>{selected.description}</p>}<div className="dish-modal-meta"><strong>{selected.priceRub.toLocaleString('ru-RU')} ₽</strong>{selected.portion && <span>{selected.portion}</span>}</div><a href={selected.sourceUrl} target="_blank" rel="noreferrer">Источник данных <Arrow diagonal /></a></div></Modal>}
  </section>;
}

function Atmosphere() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : gallery[active];
  const move = (direction: number) => setActive(index => index === null ? null : (index + direction + gallery.length) % gallery.length);
  return <section className="atmosphere section" id="atmosphere" aria-labelledby="atmosphere-title"><div className="wrap"><div className="atmosphere-grid"><div className="atmosphere-copy reveal"><p className="eyebrow"><span className="eyebrow-line" /> АТМОСФЕРА</p><h2 id="atmosphere-title">Остаться<br /><em>подольше.</em></h2><p>Посмотрите фотографии интерьера в карточке ресторана и выберите свой вечер.</p><a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">Увидеть нас на карте <Arrow diagonal /></a></div><div className="atmosphere-visual reveal">{gallery.length ? <button className="gallery-photo" type="button" onClick={() => setActive(0)} aria-label="Увеличить фотографию интерьера"><span className="gallery-crop"><img src={gallery[0].src} alt={gallery[0].alt} loading="lazy" /></span><span className="gallery-open">Увеличить ↗</span></button> : <div className="gallery-placeholder"><span aria-hidden="true">Х<span>+</span>С</span><div><p className="eyebrow">РЕАЛЬНЫЕ ФОТОГРАФИИ</p><a className="text-link" href={galleryUrl} target="_blank" rel="noreferrer">Смотреть галерею в Яндекс Картах <Arrow diagonal /></a></div></div>}</div></div></div>
    {current && <Modal label="Фотография интерьера" onClose={() => setActive(null)}><button className="modal-close" type="button" aria-label="Закрыть" onClick={() => setActive(null)}>×</button><div className="gallery-large-crop"><img src={current.src} alt={current.alt} /></div><div className="gallery-controls"><span>{active! + 1} / {gallery.length}</span><a href={current.source} target="_blank" rel="noreferrer">Источник фотографии <Arrow diagonal /></a>{gallery.length > 1 && <div><button type="button" aria-label="Предыдущая фотография" onClick={() => move(-1)}>←</button><button type="button" aria-label="Следующая фотография" onClick={() => move(1)}>→</button></div>}</div></Modal>}
  </section>;
}

function Contacts() {
  return <section className="contacts section" id="contacts" aria-labelledby="contacts-title"><div className="wrap"><div className="section-heading reveal"><div><p className="eyebrow"><span className="eyebrow-line" /> ДО ВСТРЕЧИ</p><h2 id="contacts-title">Найдёмся<span className="period">.</span></h2></div><p className="section-intro">Салехард, улица Чубынина, 24. Позвоните нам или откройте маршрут на карте.</p></div><div className="contact-grid reveal"><a className="contact-item" href={mapUrl} target="_blank" rel="noreferrer"><span className="contact-kicker">01 / АДРЕС</span><strong>Чубынина, 24<br />Салехард</strong><span className="contact-bottom">Построить маршрут <Arrow diagonal /></span></a><a className="contact-item" href="tel:+73492237340"><span className="contact-kicker">02 / ТЕЛЕФОН</span><strong>+7 (34922)<br />3-73-40</strong><span className="contact-bottom">Позвонить <Arrow diagonal /></span></a><a className="contact-item" href={menuUrl} target="_blank" rel="noreferrer"><span className="contact-kicker">03 / МЕНЮ</span><strong>Выберите<br />свой вечер</strong><span className="contact-bottom">Актуальное меню <Arrow diagonal /></span></a></div></div></section>;
}

function App() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { nodes.forEach(node => node.classList.add('visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <><a className="skip-link" href="#menu">Перейти к меню</a><Header /><main><Hero /><MenuSection /><Atmosphere /><Contacts /></main><footer className="footer"><div className="wrap footer-inner"><a href="#top" className="footer-brand">Хмель<span>&</span>Соль.</a><span>Салехард · Чубынина, 24</span><a href="#top">Наверх ↑</a></div></footer></>;
}

export default App;
