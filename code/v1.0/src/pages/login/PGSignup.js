import { useState } from 'react'
import { Link } from 'react-router-dom'
// import Resizer from "react-image-file-resizer";
import { useSignup } from '../../hooks/useSignup'
import { useImageUpload } from '../../hooks/useImageUpload';
import { useSendEmail } from '../../hooks/useSendEmail';

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)
  const { signup, isPending, error } = useSignup()
  const { imgUpload, isImgCompressPending, imgCompressedFile } = useImageUpload()
  const { sendMyEmail, isSendEmailPending } = useSendEmail()


  //Sign Email Format
  // const emailSubject = 'Welcome to HYPER CLOUD DIGITAL SOLUTIONS!';
  const emailSubject = 'Welcome to Propdial!';
  const emailBody = '<strong>Dear User,</strong><br/><br/>' +
    'Thank you for signing up with HYPER CLOUD DIGITAL SOLUTIONS!<br/><br/> We are excited to have you as a member of our community.<br/><br/>' +
    'As a registered member, you now have access to all the features and benefits of our platform.<br/>' +
    'To get started, simply log in to your account using the credentials you provided during sign up.<br/><br/>' +
    'If you have any questions or need any assistance, feel free to reach out to our support team.<br/><br/>' +
    'Thank you again for choosing Hyper Cloud Digital Solutions and we look forward to seeing you around our platform!<br/><br/>' +
    '<strong>Best regards,</strong><br/>' +
    'HYPER CLOUD TEAM';
  let ccList = '';
  let bccList = 'atul@hyperclouddigital.com';

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, phoneNumber, displayName, thumbnail)

    // sendMyEmail(email, ccList, bccList, emailSubject, emailBody);
  }

  const handleFileChange = async (e) => {
    setThumbnail(null)
    let file = e.target.files[0]
    console.log('file original selected:', file)
    console.log('file size original selected:', file.size)
    // const image = await resizeFile(file);
    // const newImageFile = dataURIToBlob(image);

    const compressedImage = await imgUpload(file, 300, 300);
    console.log('imgCom compressed in Signup.js', compressedImage);
    console.log('imgCom size after compressed in Signup.js', compressedImage.size);


    if (!compressedImage) {
      setThumbnailError('Please select a file')
      return
    }
    if (!compressedImage.type.includes('image')) {
      setThumbnailError('Selected file must be an image')
      return
    }

    // if (newImageFile.size > 20000000) {
    //   setThumbnailError('Image file size must be less than 20mb')
    //   return
    // }

    setThumbnailError(null)
    setThumbnail(compressedImage)
    console.log('thumbnail updated')
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '350px' }}>

      <div className='page-title'>
        {/* <span className="material-symbols-outlined">
            login
          </span> */}
        <h1>Sign-up</h1>
      </div>
      <br />
      <label>
        <div className='form-field-title'>
          <span className="material-symbols-outlined">
            badge
          </span>
          <h1>Name </h1>
          <input
            required
            type="text"
            maxLength={30}
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </div>
      </label>

      <label>
        <div className='form-field-title'>
          <span className="material-symbols-outlined">
            phone_android
          </span>
          <h1>Phone </h1>
          <input
            required
            type="number"
            maxLength={10}
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber}
          />
        </div>
      </label>

      <label>
        <div className='form-field-title'>
          <span className="material-symbols-outlined">
            person
          </span>
          <h1>Email </h1>
          <input
            required
            type="email"
            maxLength={50}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
      </label>
      <label>
        <div className='form-field-title'>
          <span className="material-symbols-outlined">
            lock
          </span>
          <h1>Password </h1>

          <input
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
      </label>


      <label>
        <div className='form-field-title'>
          <span className="material-symbols-outlined">
            account_circle
          </span>
          <h1>Profile Photo</h1>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>

        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!isPending && <button className="btn">Sign up</button>}
        {isPending && <button className="btn" disabled>Redirecting...</button>}
        {error && <div className="error">{error}</div>}
      </div>

      <br /><br />
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: 'var(--lightgrey-color)' }} > Already have an account? <Link to='/Login' style={{ paddingLeft: '5px', color: 'var(--red-color)' }}> Login </Link> </span>
      </div>
    </form>
  )
}
