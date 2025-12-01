import ReactSwagger from '@/components/common/swagger/react-swagger';
import { getApiDocs } from '@/lib/swagger';
import React from 'react';

const page = async () => {
   const spec = await getApiDocs();
   return (
      <section className="container">
         <ReactSwagger spec={spec} />
      </section>
   );
};

export default page;
