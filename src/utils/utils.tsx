export const getErrorsMsg = (errors: any) => {
  const errorsMsg: string[] = errors.map((item: any) => item.msg)
  return errorsMsg
}

export const lineBreakStatements = (arr: string[]) => {
  const concatStr = arr.join('\n')
  return concatStr
}
