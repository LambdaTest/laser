import React from 'react'
import Image from '../Tags/Image'
import Text from '../Tags/Text'

export default function NoData({msg}:{msg?: any}) {
    return (
        <Text className="px-20  mb-15 flex items-center justify-center flex-col py-80">
            <Image src="/assets/images/chemical_funnel.svg" width="200" />
            <Text size="h5" className="mt-20 opacity-40" dangerouslySetInnerHTML={{
            __html: msg ? msg : 'No Data Available',
          }}></Text>
        </Text>
    )
}
