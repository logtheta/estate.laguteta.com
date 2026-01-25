// Properties data - add new properties here
const PROPERTIES = [
    {
        id: 'giardino',
        name: {
            en: 'Il Giardino',
            it: 'Il Giardino'
        },
        type: {
            en: 'Citrus Grove',
            it: 'Agrumeto'
        },
        location: {
            en: 'Bruzzano Zeffirio (RC), Calabria, Italy',
            it: 'Bruzzano Zeffirio (RC), Calabria, Italia'
        },
        mapsUrl: 'https://www.google.com/maps?q=38.00286257765109,16.086229291322553',
        size: '1 hectare',
        distance: {
            en: '4 min from the sea',
            it: '4 min dal mare'
        },
        description: {
            en: `Unique opportunity! Land of 1 hectare for sale, just 4 minutes from the sea, with citrus and olive trees—bergamot, mandarins, and olives—perfect for private use or for developing a farmhouse business.

The property features an artesian well with water available year-round, never dry (unlike adjacent properties). Included in the sale are a tractor and a generator.

The land comes with a spacious house and garage, which can be purchased together or separately. This is a true chance for foreigners to live in a corner of paradise, off grid, immersed in Mediterranean nature!`,
            it: `Occasione unica! Vendesi terreno agricolo di 1 ettaro con agrumeto e oliveto, a soli 4 minuti dal mare. Il terreno include piante di bergamotto, mandarini e ulivi, ideale sia per uso privato che per sviluppare un agriturismo.

Presente pozzo artesiano con acqua disponibile tutto l'anno, mai a secco (diversamente dai terreni adiacenti). Inclusi trattore e gruppo elettrogeno.

Sul terreno è annessa una spaziosa casa con garage, che può essere acquistata insieme o separatamente. Grande opportunità per vivere immersi nella natura o avviare una propria attività off-grid.`
        },
        pricing: [
            {
                label: { en: 'Land only', it: 'Solo terreno' },
                price: { en: '€120,000', it: '€120.000' }
            },
            {
                label: { en: 'House + Garage', it: 'Casa + Garage' },
                price: { en: '€100,000', it: '€100.000' }
            },
            {
                label: { en: 'Complete package', it: 'Pacchetto completo' },
                price: { en: '€200,000 Negotiable', it: '€200.000 Trattabile' }
            }
        ],
        features: [
            { icon: 'tree', label: { en: 'Citrus & Olive Trees', it: 'Agrumeto e Oliveto' } },
            { icon: 'water', label: { en: 'Artesian Well', it: 'Pozzo Artesiano' } },
            { icon: 'tractor', label: { en: 'Tractor Included', it: 'Trattore Incluso' } },
            { icon: 'bolt', label: { en: 'Generator Included', it: 'Generatore Incluso' } }
        ],
        media: [
            { type: 'image', src: 'images/giardino/main.png' },
            { type: 'image', src: 'images/giardino/1.png' },
            { type: 'image', src: 'images/giardino/2.png' },
            { type: 'image', src: 'images/giardino/3.jpeg' },
            { type: 'image', src: 'images/giardino/4.png' },
            { type: 'video', src: 'images/giardino/drone.mp4', poster: 'images/giardino/1.png' },
            { type: 'image', src: 'images/giardino/drone2.png' },
            { type: 'image', src: 'images/giardino/IMG_0252 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0255 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0256 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0257 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0258 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0261 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0263 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0264 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0266 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0267 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0271 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0272 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0274 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0275 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0277 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0278 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0281 Large.jpeg' },
            { type: 'image', src: 'images/giardino/IMG_0282 Large.jpeg' }
        ],
    },
    {
        id: 'bivio',
        name: {
            en: 'Bivio',
            it: 'Bivio'
        },
        type: {
            en: 'Ruin with Land',
            it: 'Rudere con Terreno'
        },
        location: {
            en: 'Contrada Fiumarella, Brancaleone (RC), Calabria, Italy',
            it: 'Contrada Fiumarella, Brancaleone (RC), Calabria, Italia'
        },
        mapsUrl: 'https://www.google.com/maps?q=37.98885382214585,16.086520101759852',
        size: '718 sqm',
        distance: {
            en: '5 min from the sea',
            it: '5 min dal mare'
        },
        description: {
            en: `Unique opportunity: land just 5 minutes from the sea!

For sale: approximately 718 sqm plot with a ruin to renovate, situated in a peaceful, nature-filled area—ideal for those seeking relaxation and privacy. The plot has direct access from the main road (Contrada Fiumarella) and benefits from a strategic location: only 3.2 km from the sea.

Here, you'll find tranquility, beautiful green surroundings, and the perfect place to build your dream home or a holiday retreat near the coast. The existing ruin is a rare opportunity for buyers to design and add value to the property exactly as they wish.

Great investment or second-home opportunity, especially for international buyers: living near the Italian sea means enjoying a high quality of life, mild climate, and strong real estate appreciation potential!`,
            it: `Occasione unica: terreno a 5 minuti dal mare!

Vendesi terreno di circa 718 mq con rudere da ristrutturare, situato in una zona tranquilla e immersa nella natura, perfetta per chi desidera relax e privacy. Il terreno è facilmente accessibile direttamente dalla strada principale (Contrada Fiumarella) e si trova in una posizione strategica: a soli 3,2 km dal mare.

L'area offre pace, verde e la possibilità di realizzare la casa dei sogni o una seconda residenza vicino alla costa. La presenza di un rudere esistente rappresenta un'opportunità per personalizzare e valorizzare la proprietà secondo le proprie esigenze.

Perfetto come investimento o punto di partenza per chi desidera trasferirsi o soggiornare in Italia, anche per acquirenti dall'estero: vivere vicino al mare in Italia vuol dire qualità della vita, clima mite e grande potenziale di rivalutazione immobiliare!`
        },
        pricing: [
            {
                label: { en: 'Land with ruin', it: 'Terreno con rudere' },
                price: { en: '€35,000', it: '€35.000' }
            }
        ],
        features: [
            { icon: 'default', label: { en: '718 sqm Plot', it: 'Terreno 718 mq' } },
            { icon: 'default', label: { en: 'Ruin to Renovate', it: 'Rudere da Ristrutturare' } },
            { icon: 'default', label: { en: 'Road Access', it: 'Accesso Strada' } },
            { icon: 'water', label: { en: '3.2 km to Sea', it: '3,2 km dal Mare' } }
        ],
        media: [
            { type: 'image', src: 'images/bivio/main.png' },
            { type: 'image', src: 'images/bivio/1.png' },
            { type: 'image', src: 'images/bivio/2.jpg' },
            { type: 'image', src: 'images/bivio/3.jpg' }
        ],
    }
];

// UI translations
const TRANSLATIONS = {
    en: {
        'logo': 'Properties for Sale',
        'badge.forSale': 'For sale',
        'description.title': 'Description',
        'contact.title': 'Contact the Owner',
        'form.name': 'Name',
        'form.email': 'Email',
        'form.phone': 'Phone (optional)',
        'form.message': 'Message',
        'form.submit': 'Send Message',
        'form.note': "We'll get back to you soon",
        'footer.rights': 'All rights reserved.',
        'pricing.title': 'Pricing Options'
    },
    it: {
        'logo': 'Proprietà in vendita',
        'badge.forSale': 'In vendita',
        'description.title': 'Descrizione',
        'contact.title': 'Contatta il Proprietario',
        'form.name': 'Nome',
        'form.email': 'Email',
        'form.phone': 'Telefono (opzionale)',
        'form.message': 'Messaggio',
        'form.submit': 'Invia Messaggio',
        'form.note': 'Ti risponderemo presto',
        'footer.rights': 'Tutti i diritti riservati.',
        'pricing.title': 'Opzioni di Prezzo'
    }
};

