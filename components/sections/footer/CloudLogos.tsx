import Link from 'next/link';
import { AiFillInstagram, AiFillLinkedin, AiFillFacebook, AiFillGithub, AiFillBehanceSquare } from 'react-icons/ai';

export default function CloudLogos() {
    return (
        <div className='flex space-x-5 pt-2'>
            <Link href="https://www.instagram.com/findmalek" target='_blank'>
                <AiFillInstagram className='h-5 w-5' />
            </Link>
            <Link href="https://www.linkedin.com/in/malek-gara-hellal-a2936221a/" target='_blank'>
                <AiFillLinkedin className='h-5 w-5' />
            </Link>
            <Link href="https://www.facebook.com/malekgh.py/" target='_blank'>
                <AiFillFacebook className='h-5 w-5' />
            </Link>
            <Link href="https://github.com/FindMalek" target='_blank'>
                <AiFillGithub className='h-5 w-5' />
            </Link>
            <Link href="https://www.behance.net/malekpy" target='_blank'>
                <AiFillBehanceSquare className='h-5 w-5' />
            </Link>
        </div>
    )
}