import { HOTLINE, WHATSAPP } from "@/utils/contact";

export interface BranchInfo {
  id: string;
  name: string;
  shortName: string;
  address: string;
  time: string;
  phone: string;
  whatsapp?: string;
  bookingUrl?: string;
  callLabel?: string;
  directionsLabel?: string;
  whatsappLabel?: string;
  bookLabel?: string;
  mapUrl: string;
  reviewUrl: string;
  statusText: string;
  isOpenNow: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  popular?: boolean;
}

export interface DoctorItem {
  id: number | string;
  name: string;
  spec: string;
  degree: string;
  branch: string;
  branchTitle: string;
  time: string;
  days: string;
  img: string;
  bio: string;
  bmdcReg?: string;
}

export interface CareGuideItem {
  id: number | string;
  title: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  excerpt: string;
  thumbUrl: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  branch: string;
  rating: number;
  comment: string;
  date: string;
}

export const BRANCHES_DATA: Record<string, BranchInfo> = {
  mirpur: {
    id: "mirpur",
    name: "Mirpur Branch",
    shortName: "Mirpur Branch",
    address: "827 (2nd Floor), Shewrapara, Mirpur, Dhaka",
    time: "Opening time: 10 AM - 9 PM",
    phone: HOTLINE,
    whatsapp: WHATSAPP,
    mapUrl: "https://maps.google.com/?q=Tech+Dental+Shewrapara+Mirpur+Dhaka",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJTechDentalMirpur",
    statusText: "Open Now",
    isOpenNow: true,
  },
  badda: {
    id: "badda",
    name: "Badda Branch",
    shortName: "Badda Branch",
    address: "Cha-68/1, Pragati Sarani, Middle Badda, Dhaka",
    time: "Opening time: 03.00 PM - 9.00 PM",
    phone: HOTLINE,
    whatsapp: WHATSAPP,
    mapUrl: "https://maps.google.com/?q=Tech+Dental+Middle+Badda+Dhaka",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJTechDentalBadda",
    statusText: "Open Soon",
    isOpenNow: false,
  },
  uttara: {
    id: "uttara",
    name: "Uttara Branch",
    shortName: "Uttara Branch",
    address: "House 18, Road 14, Sector 3, Uttara, Dhaka",
    time: "Opening time: 03.00 PM - 9.00 PM",
    phone: HOTLINE,
    whatsapp: WHATSAPP,
    mapUrl: "https://maps.google.com/?q=Tech+Dental+Sector+3+Uttara+Dhaka",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJTechDentalUttara",
    statusText: "Open Soon",
    isOpenNow: false,
  },
  jatrabari: {
    id: "jatrabari",
    name: "Jatrabari Branch",
    shortName: "Jatrabari Branch",
    address: "Shahid Faruk Road, South Jatrabari, Dhaka",
    time: "Opening time: 03.00 PM - 9.00 PM",
    phone: HOTLINE,
    whatsapp: WHATSAPP,
    mapUrl: "https://maps.google.com/?q=Tech+Dental+Jatrabari+Dhaka",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJTechDentalJatrabari",
    statusText: "Open Soon",
    isOpenNow: false,
  },
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "consultation",
    name: "Dental Consultation",
    desc: "Intraoral checkup & report",
    price: "৳ 500",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=150&q=80",
    popular: true,
  },
  {
    id: "fiber-bridge",
    name: "Fiber Reinforced Bridge",
    desc: "Single sitting, metal-free",
    price: "৳ 4,500+",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=150&q=80",
    popular: true,
  },
  {
    id: "veneers",
    name: "Composite / Porcelain Veneers",
    desc: "Aesthetic smile correction",
    price: "৳ 3,500/t",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "rct",
    name: "Root Canal Treatment (RCT)",
    desc: "Painless rotary procedure",
    price: "৳ 4,000+",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=150&q=80",
    popular: true,
  },
  {
    id: "braces",
    name: "Orthodontic Braces",
    desc: "Teeth alignment treatment",
    price: "৳ 45,000+",
    image: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "scaling",
    name: "Scaling & Deep Polishing",
    desc: "Ultrasonic stain removal",
    price: "৳ 1,200",
    image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=150&q=80",
  },
];

export const DOCTORS_LIST: DoctorItem[] = [
  // Mirpur Branch (6 Doctors)
  {
    id: 1,
    name: "Dr. Farhana Ahmed",
    spec: "Prosthodontist",
    degree: "BDS, PGT (Prosthodontics)",
    branch: "mirpur",
    branchTitle: "Mirpur",
    time: "10:00 AM - 04:00 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80",
    bio: "Expert in single-sitting fiber reinforced bridges, cosmetic smile makeovers, and ceramic veneers.",
  },
  {
    id: 2,
    name: "Dr. Tanvir Rahman",
    spec: "Endodontist",
    degree: "BDS, PGT (Rotary Endodontics)",
    branch: "mirpur",
    branchTitle: "Mirpur",
    time: "04:00 PM - 09:00 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80",
    bio: "Specialized in painless single-visit automated rotary root canal therapy and post-core reconstructions.",
  },
  {
    id: 3,
    name: "Dr. Nusrat Jahan",
    spec: "Orthodontist",
    degree: "BDS, MS (Orthodontics)",
    branch: "mirpur",
    branchTitle: "Mirpur",
    time: "11:00 AM - 05:00 PM",
    days: "Friday & Monday Only",
    img: "https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=250&q=80",
    bio: "Dedicated to contemporary braces and clear aligner therapies for straightening crooked teeth and bite correction.",
  },
  {
    id: 4,
    name: "Dr. Sabbir Hossain",
    spec: "Oral & Dental Surgeon",
    degree: "BDS, PGT (Oral Surgery)",
    branch: "mirpur",
    branchTitle: "Mirpur",
    time: "05:00 PM - 09:00 PM",
    days: "Saturday - Wednesday",
    img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80",
    bio: "Skilled in atraumatic surgical extractions, impaction surgeries, and restorative dental emergencies.",
  },
  {
    id: 5,
    name: "Dr. Sadia Islam",
    spec: "Cosmetic Dental Surgeon",
    degree: "BDS, MPH, PGT",
    branch: "mirpur",
    branchTitle: "Mirpur",
    time: "10:00 AM - 02:00 PM",
    days: "Sunday - Thursday",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=250&q=80",
    bio: "Focused on aesthetic composite restorations, laser teeth whitening, and preventive oral healthcare.",
  },
  {
    id: 6,
    name: "Dr. Ariful Haque",
    spec: "Implantologist & Surgeon",
    degree: "BDS, PGT (Dental Implants)",
    branch: "mirpur",
    branchTitle: "Mirpur",
    time: "03:00 PM - 08:00 PM",
    days: "By Prior Appointment",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=250&q=80",
    bio: "Proficient in permanent titanium dental implants and bone augmentation surgical techniques.",
  },
  // Badda Branch (2 Doctors)
  {
    id: 7,
    name: "Dr. Mahin Chowdhury",
    spec: "Senior Dental Surgeon",
    degree: "BDS, PGT (Advanced Dentistry)",
    branch: "badda",
    branchTitle: "Badda",
    time: "03:00 PM - 09:00 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80",
    bio: "In-charge of clinical operations at Badda branch, skilled in cosmetic smile design and root canals.",
  },
  {
    id: 8,
    name: "Dr. Rashedul Karim",
    spec: "Oral Health Specialist",
    degree: "BDS, PGT (Conservative)",
    branch: "badda",
    branchTitle: "Badda",
    time: "04:00 PM - 09:00 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80",
    bio: "Expert in composite fillings, ultrasonic scaling, and pediatric dental solutions.",
  },
  // Uttara Branch (2 Doctors)
  {
    id: 9,
    name: "Dr. Anika Tabassum",
    spec: "Cosmetic Dental Surgeon",
    degree: "BDS, PGT (Aesthetic Dentistry)",
    branch: "uttara",
    branchTitle: "Uttara",
    time: "03:00 PM - 09:00 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=250&q=80",
    bio: "Leading aesthetic treatments at Uttara, specializing in dental veneers and smile transformations.",
  },
  {
    id: 10,
    name: "Dr. Kazi Imran",
    spec: "Endodontic Surgeon",
    degree: "BDS, PGT (Rotary RCT)",
    branch: "uttara",
    branchTitle: "Uttara",
    time: "04:00 PM - 09:00 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80",
    bio: "Proficient in complex root canals, re-RCT procedures, and crown bridge restorations.",
  },
  // Jatrabari Branch (2 Doctors)
  {
    id: 11,
    name: "Dr. Nazmul Hasan",
    spec: "Senior Dental Surgeon",
    degree: "BDS, PGT (Restorative)",
    branch: "jatrabari",
    branchTitle: "Jatrabari",
    time: "03:00 PM - 09:00 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=250&q=80",
    bio: "Dedicated to patient comfort, tooth extractions, and comprehensive family dental care in Jatrabari.",
  },
  {
    id: 12,
    name: "Dr. Farzana Boby",
    spec: "Dental Surgeon",
    degree: "BDS, PGT (Pediatric & General)",
    branch: "jatrabari",
    branchTitle: "Jatrabari",
    time: "04:00 PM - 08:30 PM",
    days: "Saturday - Thursday",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=250&q=80",
    bio: "Gentle approach towards pediatric dentistry, stain removal scaling, and preventive sealants.",
  },
];

export const CARE_GUIDES_LIST: CareGuideItem[] = [
  {
    id: 1,
    title: "Single-Visit Tooth Replacement with Fiber Reinforced Bridge",
    authorName: "Dr. Farhana Ahmed, BDS",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80",
    category: "Prosthodontics",
    excerpt: "Preserve your adjacent healthy teeth with minimally invasive fiber bridges. Discover how this metal-free, same-day procedure restores natural tooth aesthetics and bite strength...",
    thumbUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: 2,
    title: "Painless Root Canal Treatment: Signs & Modern Rotary Care",
    authorName: "Dr. Tanvir Rahman, BDS",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80",
    category: "Endodontics",
    excerpt: "Severe toothache or nerve infection doesn't mean losing your natural tooth. Learn how painless automated rotary technology provides quick relief and lasting crown protection...",
    thumbUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=250&q=80",
  },
  {
    id: 3,
    title: "Modern Orthodontic Braces: Achieving Perfect Teeth Alignment",
    authorName: "Dr. Nusrat Jahan, BDS",
    authorAvatar: "https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=100&q=80",
    category: "Orthodontics",
    excerpt: "Align crowded or crooked teeth with contemporary ceramic and self-ligating braces. Explore customized treatment timelines, retainers, and convenient installment plans...",
    thumbUrl: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=250&q=80",
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "t1",
    author: "Tanvir Ahmed",
    branch: "Mirpur Branch",
    rating: 5,
    comment: "Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.",
    date: "2 days ago",
  },
  {
    id: "t2",
    author: "Nusrat Jahan",
    branch: "Badda Branch",
    rating: 5,
    comment: "One of the cleanest and most hygienic clinics in Dhaka! My composite veneers look completely natural.",
    date: "1 week ago",
  },
  {
    id: "t3",
    author: "Mahmud Hasan",
    branch: "Uttara Branch",
    rating: 5,
    comment: "Fiber bridge single sitting এ কমপ্লিট করে দিয়েছে। সময় এবং খরচ দুটোই সাশ্রয়ী। Highly recommend Tech Dental!",
    date: "2 weeks ago",
  },
];

export const GALLERY_IMAGES: any[] = [
  {
    id: 7,
    title: "Mirpur Branch Photo",
    src: "https://res.cloudinary.com/aijtiabn/image/upload/v1789568105/techdental_gallery_7_Mirpur_Branch_Photo.webp",
    badge: "Uttara",
    alt: "Mirpur Branch Photo",
    type: "half-size",
    sort_order: 1,
    is_active: 1,
    created_at: "2026-09-15 12:51:16"
  },
  {
    id: 1,
    title: "Operatory",
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    badge: "Badda",
    alt: "Tech Dental Mirpur Consultation Operatory",
    type: "half-size",
    sort_order: 2,
    is_active: 1,
    created_at: "2026-09-14 13:57:59"
  },
  {
    id: 2,
    title: "Sterilization Tools",
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=500&q=80",
    badge: "Uttara",
    alt: "Dental Sterilization and Surgical Tools",
    type: "half-size",
    sort_order: 3,
    is_active: 1,
    created_at: "2026-09-14 13:57:59"
  },
  {
    id: 5,
    title: "WhatsApp Image 2026-08-31 at 5.06.04 PM (1)",
    src: "https://res.cloudinary.com/aijtiabn/image/upload/v1789568094/techdental_gallery_5_WhatsApp_Image_2026-08-31_at_5_06_04_PM__1_.jpg",
    badge: "Uttara",
    alt: "WhatsApp Image 2026-08-31 at 5.06.04 PM (1)",
    type: "half-size",
    sort_order: 4,
    is_active: 1,
    created_at: "2026-09-14 14:04:24"
  },
  {
    id: 6,
    title: "18757",
    src: "https://res.cloudinary.com/aijtiabn/image/upload/v1789568099/techdental_gallery_6_18757.jpg",
    badge: "Badda",
    alt: "18757",
    type: "half-size",
    sort_order: 5,
    is_active: 1,
    created_at: "2026-09-14 14:07:12"
  },
  {
    id: 3,
    title: "Modern Ergonomic Chair",
    src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=500&q=80",
    badge: "Uttara",
    alt: "Modern Patient Ergonomic Chair & Tech",
    type: "half-size",
    sort_order: 6,
    is_active: 1,
    created_at: "2026-09-14 13:57:59"
  },
  {
    id: 4,
    title: "18761",
    src: "https://res.cloudinary.com/aijtiabn/image/upload/v1789568089/techdental_gallery_4_18761.jpg",
    badge: "Badda",
    alt: "18761",
    type: "half-size",
    sort_order: 7,
    is_active: 1,
    created_at: "2026-09-14 14:02:06"
  },
  {
    id: 8,
    title: "Mirpur Branch Photo",
    src: "https://res.cloudinary.com/aijtiabn/image/upload/v1789568110/techdental_gallery_8_Mirpur_Branch_Photo.webp",
    badge: "Mirpur",
    alt: "Mirpur Branch Photo",
    type: "half-size",
    sort_order: 8,
    is_active: 1,
    created_at: "2026-09-15 13:11:48"
  },
  {
    id: 9,
    title: "Mirpur Branch Photo",
    src: "https://res.cloudinary.com/aijtiabn/image/upload/v1789568116/techdental_gallery_9_Mirpur_Branch_Photo.webp",
    badge: "Jatrabari",
    alt: "Mirpur Branch Photo",
    type: "half-size",
    sort_order: 9,
    is_active: 1,
    created_at: "2026-09-15 13:12:14"
  }
];
