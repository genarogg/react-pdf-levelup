import React from 'react'
import { View } from "@react-pdf/renderer"

interface BreakPageProps { }

const BreakPage: React.FC<BreakPageProps> = () => {
    return <View break />
}

export default BreakPage;