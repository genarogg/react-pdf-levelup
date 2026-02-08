import React from 'react'
import { View } from "@react-pdf/renderer"

interface NextPageProps { }

const NextPage: React.FC<NextPageProps> = () => {
    return <View break />
}

export default NextPage;