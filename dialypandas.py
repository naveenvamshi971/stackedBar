##### IMPORTING ALL REQUIRED MODULES TO CREATE AND FORMAT EXCEL FILE#####

import json,csv,os,time
from datetime import datetime
import pytz,string
import pandas as pd
import openpyxl
import boto3
import io
import xlsxwriter

from openpyxl.styles import PatternFill,Border,Side

class Mytestfunction():
    result = dict()

    def run(self,QueryResult,FolderPath,FolderName):
        try:
            ### Checking if Directory Already Exists with use case Name if not then create it
            now = datetime.now()
            date_time = now.strftime("%Y-%m-%d-%H_%M_%S")
            self.Write_Log('info', 'date_time')
            self.Write_Log('info', date_time)
            FilePath = FolderPath +"GRC_Autotrack_Daily_"+ date_time +".xlsx"
            FileName = "GRC_Autotrack_Daily_"+ date_time +".xlsx"
            #GRC_Reporting/Dev/autotrack.xlsx

            self.Write_Log('info', 'FilePath')
            self.Write_Log('info', FilePath)




            retData = self.CreateExcelData(QueryResult)
            
            self.Write_Log('info', 'creating execl data from the query result')
            count = len(QueryResult)+1
            self.Write_Log('info', 'count')
            self.Write_Log('info', count)

            s3_client = boto3.client(
                "s3",
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            )
            
            fieldscount = len(retData)

            df = pd.DataFrame(
                data= retData
            )
            print(df)
            
            


            #df = pd.DataFrame.from_dict(retData)
           
            with io.BytesIO() as output:
                with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                    df.to_excel(writer, sheet_name='Sheet1', startrow=1, header=False, index=False)
                    # Get the xlsxwriter workbook and worksheet objects.
                    workbook  = writer.book
                    worksheet = writer.sheets['Sheet1']

                    # Add a header format.
                    header_format = workbook.add_format({
                        'bold': True,
                        'text_wrap': True,
                        'valign': 'top',
                        'fg_color': '#75ffbf',
                        'border': 1})

                    # Write the column headers with the defined format.
                    for col_num, value in enumerate(df.columns.values):
                        df.columns.str.upper()
                        worksheet.write(0, col_num , value, header_format)
                        
                    column_settings = [{'header': column} for column in df.columns]
                    (max_row, max_col) = df.shape

                    worksheet.add_table(0, 0, max_row, max_col - 1, {'columns': column_settings})
                    border_fmt = workbook.add_format({'bottom':1, 'top':1, 'left':1, 'right':1})
                    worksheet.conditional_format(xlsxwriter.utility.xl_range(0, 0, len(df), len(df.columns)), {'type': 'no_errors', 'format': border_fmt})
                    #writer.save()
                    worksheet.autofit()

                data = output.getvalue()

                response = s3_client.put_object(
                    Bucket=AWS_S3_BUCKET, Key=FilePath, Body=data
                )

                status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

                if status == 200:
                    print(f"Successful S3 put_object response. Status - {status}")
                else:
                    print(f"Unsuccessful S3 put_object response. Status - {status}")
                
                                      
            #print the outut for script execution success   
            self.result['retCode'] = "0"
            self.result['retDesc'] = "GRC Sample Report  (Excel File) Created"
            self.result['FilePath'] = FilePath
            self.result['FileName'] = FileName
            self.result['Successflag'] = "0"
            return (True, json.loads(json.dumps(self.result)))
            
        except Exception as err:
        # if any error occurred during script execution
            Msg=str(err)
            #print(err)
            self.Write_Log('error', 'report creation failed')            
            Msg=Msg.split('\n')[0]
            self.result['retCode'] = "1"
            self.result['retDesc'] = "Script failed for Report creation - {0}".format(Msg)
            self.result['FilePath'] = 'NA'
            self.result['FileName'] = 'NA'
            self.result['Successflag'] = "1"
            return (False, json.loads(json.dumps(self.result)))


    def CreateExcelData(self,QueryResult):
        try:
            count = len(QueryResult)
            if(count<=0):
                return count
            else:
                first_row = QueryResult[0]
                #print(first_row.keys())
                data = dict()
                for key in first_row.keys():
                    temp_list =[]
                    for row in QueryResult:
                        temp_list.append(row.get(key))
                    data[key] = temp_list
            #print(data)
            return(data)

        except Exception as err:
        # if any error occurred during script execution
            Msg=str(err)
            Msg=Msg.split('\n')[0]
            self.result['retCode'] = "1"
            self.result['retDesc'] = "Script failed for Creating Excel Data - {0}".format(Msg)
            self.result['FilePath'] = 'NA'
            self.result['FileName'] = 'NA'
            self.result['Successflag'] = "1"
            return (False, json.loads(json.dumps(self.result)))


    def Write_Log(self, log_type,log_message):
        # User defined function to Write Log messages
        try:
            logMessage_dateTime_format = "%d-%m-%Y %H:%M:%S:%f"
            dateTime = datetime.now().strftime(logMessage_dateTime_format)
            if(log_type == "info"):
                #self.logger.error(dateTime + " - " + log_message)
                print(dateTime + " - " + log_message)
            elif(log_type == "error"):
                self.logger.error(dateTime + " - " + log_message)
            elif(log_type == "warning"):
                self.logger.warning(dateTime + " - " + log_message)
        except Exception as err:
            Msg=str(err)

