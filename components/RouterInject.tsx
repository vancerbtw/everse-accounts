import React, { Component } from "react";
import { useRouter } from 'next/router'

export default (WrappedComponent: any) => {
  const router = useRouter();

  const {...propsWithoutRouter } = props;

  return (
    <Component router={router} />
  )
}