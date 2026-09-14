// Shared catalog for the children's books store.
export type Book = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  cover: string;
  price: string;
  color: string;
  pages: string;
  features: string[];
};

export const BOOKS: Book[] = [
  {
    id: 'superheroe',
    title: 'El Superheroe de [Nombre]',
    shortTitle: 'El Superheroe',
    description: 'Tu niño/a es el protagonista de su propia aventura de superheroe. Incluye su nombre, apariencia y poderes especiales.',
    longDescription: 'Imagina a tu hijo/a volando sobre la ciudad con una capa roja brillante, rescatando a sus amigos y superando obstaculos con sus poderes especiales. Este libro personalizado convierte a tu niño/a en el superheroe mas valiente del universo. Con ilustraciones coloridas y una historia emocionante, cada pagina es una aventura unica.',
    cover: '/covers/superheroe.jpg',
    price: '$19.99',
    color: 'from-blue-500 via-indigo-500 to-purple-600',
    pages: '24 páginas',
    features: ['Nombre personalizado', 'Color de capa a elegir', 'Superpoderes unicos', 'Ciudad personalizada'],
  },
  {
    id: 'princesa',
    title: 'Mi Princesa Favorita',
    shortTitle: 'Mi Princesa',
    description: 'Una historia magica donde tu hija es la princesa mas valiente del reino. Con dragones, castillos y mucho amor.',
    longDescription: 'Tu hija se convierte en la princesa mas valiente del reino, enfrentando dragones amigables, explorando castillos encantados y haciendo amigos en el bosque magico. Con ilustraciones deslumbrantes y una historia de valentia, este libro celebrara la fortaleza y la imaginacion de tu pequeña.',
    cover: '/covers/princesa.jpg',
    price: '$19.99',
    color: 'from-pink-400 via-rose-500 to-fuchsia-600',
    pages: '24 páginas',
    features: ['Nombre de la princesa', 'Color del vestido', 'Animal magico favorito', 'Castillo personalizado'],
  },
  {
    id: 'espacio',
    title: 'Aventura en el Espacio',
    shortTitle: 'Aventura Espacio',
    description: 'Tu hijo/a viaja a la luna y mas alla en esta emocionante aventura espacial. Con planetas, cohetes y aliens amigables.',
    longDescription: 'Un viaje épico al espacio donde tu niño/a explora la luna, visita planetas lejanos y hace amigos alienigenas adorables. Con un cohete personalizado y un traje espacial a medida, esta aventura estimula la curiosidad y el amor por la ciencia.',
    cover: '/covers/espacio.jpg',
    price: '$22.99',
    color: 'from-indigo-400 via-blue-500 to-cyan-600',
    pages: '28 páginas',
    features: ['Nombre del astronauta', 'Color del cohete', 'Planeta favorito', 'Alien amigo personalizado'],
  },
  {
    id: 'bosque',
    title: 'El Bosque Encantado',
    shortTitle: 'El Bosque',
    description: 'Una aventura en la naturaleza donde tu niño/a hace amigos con todos los animales del bosque.',
    longDescription: 'Tu niño/a se adentra en un bosque magico lleno de luciernagas, donde hace amigos con osos simpaticos, conejos curiosos y búhos sabios. Aprende sobre la naturaleza mientras vive una aventura inolvidable en cada pagina.',
    cover: '/covers/bosque.jpg',
    price: '$19.99',
    color: 'from-green-400 via-emerald-500 to-teal-600',
    pages: '24 páginas',
    features: ['Nombre del explorador', 'Animal favorito', 'Estación del año', 'Arbol magico personalizado'],
  },
  {
    id: 'colores',
    title: 'Mi Primer Libro de Colores',
    shortTitle: 'Libro de Colores',
    description: 'Libro interactivo para los mas pequeños. Aprende colores con imagenes brillantes y texturas suaves.',
    longDescription: 'Un libro sensorial y visual diseñado para los mas pequeños de la casa. Cada pagina presenta un color diferente con animales adorables, texturas tactiles y elementos interactivos. Perfecto para estimular el desarrollo visual y cognitivo desde los primeros meses.',
    cover: '/covers/colores.jpg',
    price: '$14.99',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    pages: '16 páginas',
    features: ['Texto suave al tacto', 'Animales por color', 'Ilustraciones brillantes', 'Ideal 0-3 años'],
  },
  {
    id: 'receta',
    title: 'La Receta Magica',
    shortTitle: 'La Receta',
    description: 'Tu niño/a es el chef estrella en esta aventura culinaria. Aprende sobre comida saludable mientras se divierte.',
    longDescription: 'Tu niño/a se convierte en el chef mas famoso del mundo, creando recetas magicas que danzan en el aire. Con ingredientes coloridos y recetas divertidas, este libro inspira el amor por la cocina y la comida saludable mientras se divierte con cada pagina.',
    cover: '/covers/receta.jpg',
    price: '$19.99',
    color: 'from-red-400 via-pink-500 to-rose-500',
    pages: '24 páginas',
    features: ['Nombre del chef', 'Receta personalizada', 'Color del delantal', 'Ingrediente magico favorito'],
  },
];
