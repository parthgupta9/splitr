"use client";

import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '@/convex/_generated/api';

const Contactpage = () => {
    const data = useQuery(api.contact.getAllContacts, {});
console.log(data);
  return (
    <div>page</div>
  )
}

export default Contactpage