using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.Office.Interop.Excel;

namespace ParametersReader
{
    class Program
    {
        public static string filePath = @"C:\Users\fersolano\Documents\Performance\ParametersReader\ParametersReader\Urls.xlsx";
        static void Main(string[] args)
        {
            var urls = ReadExcelFile();
            var result = ProcessUrl(urls);
            foreach(var data in result)
            {
                var list = data.Value;
                var timeTakenAvg = list[0]/list[1];
                Console.WriteLine($"Parameter = {data.Key}, Avg = {timeTakenAvg} Use = {list[1]}");
            }

            Console.ReadLine();
        }

        private static IList<List<string>> ReadExcelFile()
        {
            Console.BackgroundColor = ConsoleColor.DarkBlue;
            Console.WriteLine("\nReading the Excel File...");
            Console.BackgroundColor = ConsoleColor.Black;


            var xlApp = new Application();
            var xlWorkBook = xlApp.Workbooks.Open(filePath, ReadOnly: false);
            var xlWorkSheet = (Worksheet)xlWorkBook.Worksheets.get_Item(1);

            var xlRange = xlWorkSheet.UsedRange;
            var totalRows = xlRange.Rows.Count;
            var totalColumns = xlRange.Columns.Count;

            IList<List<string>> sheetReaded = new List<List<string>>();

            for (var rowCount = 1; rowCount <= totalRows; rowCount++)
            {
                var row = new List<string>();
                for (var j = 1; j <= totalColumns; j++)
                    row.Add(Convert.ToString((xlRange.Cells[rowCount, j] as Range).Text));

                sheetReaded.Add(row);
            }

            xlWorkBook.Close();
            xlApp.Quit();

            Marshal.ReleaseComObject(xlWorkSheet);
            Marshal.ReleaseComObject(xlWorkBook);
            Marshal.ReleaseComObject(xlApp);

            Console.WriteLine("End of the file...");

            return sheetReaded;
        }

        private static IDictionary<string, List<int>> ProcessUrl(IList<List<string>> urls)
        {
            IDictionary<string, List<int>> resultUrls = new Dictionary<string, List<int>>();

            foreach (var url in urls)
            {
                var dataUrl = url[0].Split('&');
                for (var i = 0; i < dataUrl.Length; i++)
                {
                    var parameter = dataUrl[i].Split('=').Skip(0).ToArray()[0].Trim();
                    if (!resultUrls.ContainsKey(parameter))
                    {
                        resultUrls.Add(parameter, new List<int>()
                        {
                            Int32.Parse(url[1]),
                            1
                        });
                    }
                    else
                    {
                        var value = resultUrls[parameter];
                        value[0] += Int32.Parse(url[1]);
                        value[1]++;
                    }
                }
            }

            return resultUrls;
        }
    }
}
