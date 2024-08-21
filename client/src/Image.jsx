// export default function Image({ src, ...rest }) {
//   const imageUrl = src && src.includes('https://')
//     ? src
//     : `uploads/${src}`;
//   console.log('Image URL:', imageUrl); // Debugging line
//   return (
//     <img {...rest} src={imageUrl} alt={''} />
//   );
// }

export default function Image({src, ...rest}) {
  // Check if src is a full URL or just a file path
  const imageUrl = src && src.includes('http') 
    ? src // If src contains 'http', use it as is
    : `${import.meta.env.VITE_API_BASE_URL}/uploads/${src}`; // Prefix with base URL and uploads directory if not

  return (
    <img {...rest} src={imageUrl} alt={''} />
  );
}
