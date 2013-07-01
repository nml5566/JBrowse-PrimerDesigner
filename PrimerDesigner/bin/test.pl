 use Bio::PrimerDesigner;

  my $pd = Bio::PrimerDesigner->new;
  $pd || die Bio::PrimerDesigner->error;

  #
  # Define the DNA sequence, etc.
  #
  #my $dna   = "CGTGC...TTCGC";
  my $seqID = "sequence 1";
my $dna = "CTTCATTTTTTTTTTGTTTTTCCCTTTTGTCTTTTGCACCGCTTATATATGGGTATGAAACAAGTT"
. "CAAGAATTTATAATGGAACCCAAAGGTTCAGTCTTTGTAGTTCGAGCGACATTGCGCGTTTCCTTAGAAAAC"
. "GCTGGAAAGATATTCTTTAACGAGACGGAGTAATTCTCGTCAGGAATAGGATGTTGATTGATTTTTGCTGTAG"
. "TTATATAGCAGGGACCCACGGAAGAGAGCGAGCGCCTTCTTTCACAGGGACTTTTGTCAGCCACGTCTCCGGGG"
. "AAAACAATTGCCGTCCGCGTCGCAGTGAGATTACGCAGCCGTGCGCTTCAGGGACAGAAAAGAAGCATTTCGCG"
. "GCTACGGAGAAACCGTGCACTAACTCTCTCGAGGGTAGCCGCAAAGATTTCTTGTCTCTTCCATTAGGACATAGCTATCTTTTTCTTTTCTGTTTTTGGCGTATGATCTGTTCTGAGCCAAAGTTATAGATCATTGCTTGAATAAGCACCTCACAGAGTAGGGATTGTATAGAAAGTAGCTGAGCGTCTGCCCACGTAACAAACAATCTTGCCCCTTCCCCGCTCTTGTTTTCGCGTGCCTCTTCTACAATAATCTGGCCAGGCTGAATCGCGTTCTGCTGCTGCTGCTGCTATTGTTATTGTTGTTGTTGTTGTTTTGGCCAATTGCTTATGTGTTGGTCTGCAAATTAGCACCTCGTTCCCTGTTGGCAAACGCGCGCGTACAAGCCTTACAGGGCTTGAGAATGTTCTTCGTAGAAATGCATGCACAAAAATTCTGATCTAGCACACCATCGGTCTCTGTAGCTTCGGGCTCTATAGCTATGGGTTAGGAGTCCGTGAGTAGTAACAAGAAGAAGTATATAAAAAGCAGGTAAATCGTACTTCAATATGCTTCATTGTCACTGGATCGTCATATTCACTCTTGTTCTCATAATAGCAGTCCAAGTTTTCATCTTTGCAAGCTTTACTATTTCTTTCTTTTTATTGGTAAACTCTCGCCCATTACAAAAAAAAAAGAGATGTTCAATCGTTTTAACAAATTCCAAGCTGCTGTCGCTTTGGCCCTACTCTCTCGCGGCGCTCTCGGTGACTCTTACACCAATAGCACCTCCTCCGCAGACTTGAGTTCTATCACTTCCGTCTCGTCAGCTAGTGCAAGTGCCACCGCTTCCGACTCACTTTCTTCCAGTGACGGTACCGTTTATTTGCCATCCACAACAATTAGCGGTGATCTCACAGTTACTGGTAAAGTAATTGCAACCGAGGCCGTGGAAGTCGCTGCCGGTGGTAAGTTGACTTTACTTGACGGTGAAAAATACGTCTTCTCATCTGATCTAAAAGTTCACGGTGATTTGGTTGTCGAAAAGTCTGAAGCAAGCTACGAAGGTACCGCGTTCGACGTTTCTGGTGAGACTTTTGAAGTTTCCGGTAACTTCAGTGCTGAAGAAACTGGCGCTGTCTCCGCATCTATCTATTCATTCACACCTAGCTCGTTCAAGAGCAGCGGTGACATTTCTTTGAGTTTGTCAAAGGCCAAGAAGGGTGAAGTCACCTTTTCTCCATACTCTAACGCTGGTACCTTTTCTTTGTCAAATGCTATTCTCAACGGTGGTTCTGTTTCCGGTTTGTAACGTAGAGACGACGATGAAGGCTCTGTAAATAACGGTGAAATCAACCTAGACAATGGAAGTACCTATGTTATCGTTGAACCAGTTTCTGGAAACGGTACAATCAACATCGTCTCTGGTAACCTATACTTGCACTACCCTGACACCTTTACTGGCCAAACTGTTGTATTCAAGGGTGAAGGTGTTCTTGCCGTTGACCCAACCGAAACCAACGCCACTCCTATTCCTGTTGTTGGCTACACCGGTAAGAACCAAATTGCCATTACCGCCGACATCACTGCTCTTTCTTACGACGGTACTACTGGTGTCTTAACTGCAACCCAAGGTAACAGACAATTCTCTTTTGAAATTGGTACTGGATTCTCTAGTTCTGGCTTCAGTGTCTCCGAAGGAATCTTCGCAGGCGCCTACTCATATTACCTAAACTATGACGGTGTCATCGCTACAAGCGCCGCATCCACATCCGCATCCACTACCTCTGGTGTTGTCTCTACTGCCACTGGTTCAGTCACTTTATCCTCTAACGCTTCTACCACCGTCTCTTCTACGATCTCTTCTAGCGCCCCAGACTCAATAATTCCTTCATCTAGCGCCTCTATCTCTGGTGTCTCAAACTCCACTACAGCATCTGGTTCAATCGCTTCTACTGCTTCCACCGCTTCCACTACTTCTACTGCATCCGCTGCATCCGCCACCAGCTTCACCTCAGGTTCCGCTTCTGTCTACACTACTACATTAACTTACTTGAATGCCACAAGTACAGTCGTGGTTTCCTGTTCAGAAACAACCGACGCTAGCGGTAACATTTACACCATTACCACAACTGTCCCATGCTCATCTACCACTGCCACCATCACATCTTGTGACGAAAACGGATGCCATGTTCCAGCACCAACTGCTACCGACGCAACTGCAACCGTTTCCTCCAAGTCATACACCACTGTTACTGTTACTCACTGTGACAACAATGGCTGTAACACCAAGACTGTCACTTCTGAATGTTCTAAAGAAACTGCAGCAACCACCATTTCTCCAAAATCATACACTACTGTTACCGTTACTCACTGTGACGACAACGGCTGTAACACCAAGACTGTCACTTCCGAGGCTTCCAAACAAACATCATTGGCCACTAGCACAGTCACCAAGTCTGCTGCTCCAACTTCTCATACTGCTGCTTCCAGCACCTTCACTGGTATTGTCGTTCAATCCGAAGGTATGGCTGCTGGTTTGAGAACCAATGCTTTAAGTACTTTGGCAGGTATTTTCATCCTTGCTTTTTTTTAAAATGAGTGCGTAACCGTACTTTCCTAAAAATAACTAAGTAGAAAGTATTTTAATATATAAACGTCAGTGTAAACATTCAAGTGATTTTAACTTTACGCGGTTGAAGAATGCTGTGTTCGAACTATAAAGCGTCAGAAAAGATGGTTTAGCGAAGGCACCATTATGAAGATAGACACATTCTTCTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTCATTTACTTTTATTTCGCGCGGTCGGTAAATTTTTCGTGGGTTTCTTTGAATCTATTAGCCGACATAAGAATAATGCATAAATAATATTTTTAATGTCTTCCTATGCCCAAAAGAAGAAGTCTTGAAGTTGCCGCACATGGAAATCACATGACCATGGCTTGGCCCTTCGTTTTAAATGCAACATGCAATATGGAATGTGTCATGAATACTATCAGCAGGAACAGAAAGCGTCGTTTTGTTTCTGCAAATGCTGTAGTTTTGGGCCGAAAATAGATGTAGTAGAATATATAGTGAAACGTGATGTACAAAAGAAAAAGGTAGTTTAAAAAAAATTAGATAACTTGGATTTTTACCCTGAATATTGCATGTGATTCGTAAAGAACTGAGTTACCTCAAACGGACCTCCCTTTTCATTTCGTATTCCGCGAATCATGAAGTCATGCAATTACCTCTGAAGAGCTGACTGTCCCAAAAGAAGCTATCGAATCTGTCCTTGATTTATTTAAGCCTTGCGTTTCGAGAAAGTGAAAACCAATTGAATACAAAATAAAAAAAAAGAAGAAAGAAATAGCAGGTCTAAGATATATAAGAAAGTTAATATCATTTTTGAACATTTTATTTTAGACGCCTTCAGCCGCGCGACGCCCGGAGTAATCATATGCCCATGACTTTACCAAAAGGCAACAGGGAGGAACATGCATTAATGTGAAGCATCACTGCTGCAATTCTCGGTGTTGCTAATAATTCATGGATCGAGAAAGAGACATAACATTTAGGCCAATTTTTTGAATAAATATGAACTCAGCTAAGACTCGACAATACAATTTTCTTATACTAAACGTAGATTTATAAAATAAACACAACTGTAAGGGCAATGCAACCGTAGATGCATATATCATTTATAGAAATTATATCCAACAGAAAGCTCAGACTTATATCCGGTTTAAGAGAGAAATTCTTGCTCATATTACCCCAAGACCAGGTGGCGTGTTGAAGTTTATAACATATAAGAACTACTACCTCATGAATTCTAGTGGATGAAAGAAGCAGCACGAACACCATTTCTACAGACAACGACACATGGAAAGGTTCACCATTCCCAAAGAAAACAACGATGGCCACAAGGGTGTGGTCCTCCATTCTCCTACTGTTGGAAGGAGATATTATCCGACCGACTGTTTTGTGATATGGCAAACTATTTTTTTAAATGAGCAAAATTACTTCTTTTGGCTGGAAATGTCATTAGAAAGTGCCCAAGTGACATTTAGCTAAACTCGGGTATTGTCTACAAGACCGGTGCTGTGACCGTTTCCAATACGGAAAGAAACGGTACTGGGAGCAGGAGTTGCTTTTACAGATATGAACAATGCCAATAGAGCCGCACATGTAATTACTGGTTCACACTCGTGGGGCCCACACGATTCCTGTGCAAAGTTTGACAAGAGGATGGAGTTTCACGTAAATGCTGCCAAAGGTGATGCGGTTTTGTTTTTGGGCAGCCTCTACCATGTTGCAAGTGCGAACCATACTGTGGCCACATAGATTACAAAAAAAGTCCAGGATATCTTGCAAACCTAGCTTGTTTTGTAAACGACATTGAAAAAAGCGTATTAAGGTGAAACAATCAAGATTATCTATGCCGATGAAAAATGAAAGGTATGATTTCTGCCACAAATATATAGTAGTTATTTTATACATCAAGATGAGAAAATAAAGGGATTTTTTCGTTCTTTTATCATTTTCTCTTTCTCACTTCCGACTACTTCTTATATCTACTTTCATCGTTTCATTCATCGTGGGTGTCTAATAAAGTTTTAATGACAGAGATAACCTTGATAAGCTTTTTCTTATACGCTGTGTCACGTATTTATTAAATTACCACGTTTTCGCATAACATTCTGTAGTTCATGTGTACTAAAAAAAAAAAAAAAAAAGAAATAGGAAGGAAAGAGTAAAAAGTTAATAGAAAACAGAACACATCCCTAAACGAAGCCGCACAATCTTGGCGTTCACACGTGGGTTTAAAAAGGCAAATTACACAGAATTTCAGACCCTGTTTACCGGAGAGATTCCATATTCCGCACGTCACATTGCCAAATTGGTCATCTCACCAGATATGTTATACCCGTTTTGGAATGAGCATAAACAGCGTCGAATTGCCAAGTAAAACGTATATAAGCTCTTACATTTCGATAGATTCAAGCTCAGTTTCGCCTTGGTTGTAAAGTAGGAAGAAGAAGAAGAAGAAGAGGAACAACAACAGCAAAGAGAGCAAGAACATCATCAGAAATACCAATGTTGAAGTCAGCCGTTTATTCAATTTTAGCCGCTTCTTTGGTTAATGCAGGTACCATACCCCTCGGAAAGTTATCTGACATTGACAAAATCGGAACTCAAACGGAAATTTTCCCATTTTTGGGTGGTTCTGGGCCATACTACTCTTTCCCTGGTGATTATGGTATTTCTCGTGATTTGCCGGAAAGTTGTGAAATGAAGCAAGTGCAAATGGTTGGTAGACACGGTGAAAGATACCCCACTGTCAGCAAAGCCAAAAGTATCATGACAACATGGTACAAATTGAGTAACTATACCGGTCAATTCAGCGGAGCATTGTCTTTCTTGAACGATGACTACGAATTTTTCATTCGTGACACCAAAAACCTAGAAATGGAAACCACACTTGCCAATTCGGTCAATGTTTTGAACCCATATACCGGTGAGATGAATGCTAAGAGACACGCTCGTGATTTCTTGGCGCAATATGGCTACATGGTCGAAAACCAAACCAGTTTTGCCGTTTTTACGTCTAACTCGAACAGATGTCATGATACTGCCCAGTATTTCATTGACGGTTTGGGTGATAAATTCAACATATCCTTGCAAACCATCAGTGAAGCCGAGTCTGCTGGTGCCAATACTCTGAGTGCCCACCATTCGTGTCCTGCTTGGGACGATGATGTCAACGATGACATTTTGAAAAAATATGATACCAAATATTTGAGTGGTATTGCCAAGAGATTAAACAAGGAAAACAAGGGTTTGAATCTGACTTCAAGTGATGCAAACACTTTTTTTGCATGGTGTGCATATGAAATAAACGCTAGAGGTTACAGTGACATCTGTAACATCTTCACCAAAGATGAATTGGTCCGTTTCTCCTACGGCCAAGACTTGGAAACTTATTATCAAACGGGACCAGGCTATGACGTCGTCAGATCCGTCGGTGCCAACTTGTTCAACGCTTCAGTGAAACTACTAAAGGAAAGTGAGGTCCAGGACCAAAAGGTTTGGTTGAGTTTCACCCACGATACCGATATTCTGAACTATTTGACCACTATCGGCATAATCGATGACAAAAATAACTTGACCGCCGAACATGTTCCATTCATGGAAAACACTTTCCACAGATCCTGGTACGTTCCACAAGGTGCTCGTGTTTACACTGAAAAGTTCCAGTGTTCCAATGACACCTATGTTAGATACGTCATCAACGATGCTGTCGTTCCAATTGAAACCTGTTCTACTGGTCCAGGGTTCTCCTGTGAAATAAATGACTTCTACGACTATGCTGAAAAGAGAGTAGCCGGTACTGACTTCCTAAAGGTCTGTAACGTCAGCAGCGTCAGTAACTCTACTGAATTGACCTTTTTCTGGGACTGGAATACCAAGCACTACAACGACACTTTATTAAAACAGTAAATAGATAATATGATTATGTAATTTTAGAAACTAATTATGAATACCGATTTATTTTTTTTTTTTTTTTTCACTTTTGCTGGCAAGAAATACGAAATTGCAATGACGATCACAGTCCAAAGAGGTAAGCACAAAGGCGCAGTATGTGATTACTCTATCATTCTTTAGCAAAACCAGGATAGGAGTATATGTATAAGAAATATGCAACGCCATCATTTAATGCAATAGACACGACATGCCCTTTACATGAGGTGGTACAATGTTTTAATATTGTGTCAGGGCAAGTACATGATAATATCGTTTAAAGATGATGCTAGAGTAAAAGTATGAAGTGAAAGAAAAGGGCAATTGATTGACTAAGCGGATGTTGTAGGATGATATAGTGGCTCATGATCTGTAAATGATCGGTTGACCGCAGTATTATATAATAACATCCGTATAAGTACATATACTACCATGTCTGTTCTCTACATTGCTTTTTATTCAAGATTATTGGTTTTCCTAACCGCCGCGCCGCGCAGGTACCCCGCGCATCTCTTCTTCTCGAAGAAAGCGGAAAAAACAAAAAAAAAAGTATAAATAGTGGAGTCTTTTCCCATTTAACATTTAGAAAAAAATTCGAATGGAAATTTCTTGCCGAACATTTAACCGGAGACCCTTGGCGGCTTTTTCTCAGTTTCGTGGGCTAGTACATTTTACCTAGTATGCTGGGAACTTTTTTTCCGTATTCTATTCTATTCCTTGCCTTACTTTTCTTATCATTTTTTATATAACCAATTTCAAAAATACTTTTTAACTGTCATAGACGCATTTTGTTTATTACAAATTAAAAGAATCAAATATAATATGTGCAATTAATAACTCCACAAGTAGCGAAAGCAATGGCCGCCATTAGAGACTACAAGACCGCACTAGATCTTACCAAGAGCCTACCAAGACCGGATGGTTTGTCAGTGCAGGAACTGATGGACTCCAAGATCAGAGGTGGGTTGGCTTATAACGATTTTTTAATCTTACCAGGTTTAGTCGATTTTGCGTCCTCTGAAGTTAGCCTACAGACCAAGCTAACCAGGAATATTACTTTAAACATTCCATTAGTATCCTCTCCAATGGACACTGTGACGGAATCTGAAATGGCCACTTTTATGGCTCTGTTGGATGGTATCGGTTTCATTCACCATAACTGTACTCCAGAGGACCAAGCTGACATGGTCAGAAGAGTCAAGAACTATGAAAATGGGTTTATTAACAACCCTATAGTGATTTCTCCAACTACGACCGTTGGTGAAGCTAAGAGCATGAAGGAAAAGTATGGATTTGCAGGCTTCCCTGTCACGGCAGATGGAAAGAGAAATGCAAAGTTGGTGGGTGCCATCACCTCTCGTGATATACAATTCGTTGAGGACAACTCTTTACTCGTTCAGGATGTCATGACCAAAAACCCTGTTACCGGCGCACAAGGTATCACATTATCAGAAGGTAACGAAATTCTAAAGAAAATCAAAAAGGGTAGGCTACTGGTTGTTGATGAAAAGGGTAACTTAGTTTCTATGCTTTCCCGAACTGATTTAATGAAAAATCAGAAGTACCCATTAGCGTCCAAATCTGCCAACACCAAGCAACTGTTATGGGGTGCTTCTATTGGGACTATGGACGCTGATAAAGAAAGACTAAGATTATTGGTAAAAGCTGGCTTGGATGTCGTCATATTGGATTCCTCTCAAGGTAACTCTATTTTCCAATTGAACATGATCAAATGGATTAAAGAAACTTTCCCAGATTTGGAAATCATTGCTGGTAACGTTGTCACCAAGGAACAAGCTGCCAATTTGATTGCTGCCGGTGCGGACGGTTTGAGAATTGGTATGGGAACTGGCTCTATTTGTATTACCCAAAAAGTTATGGCTTGTGGTAGGCCACAAGGTACAGCCGTCTACAACGTGTGTGAATTTGCTAACCAATTCGGTGTTCCATGTATGGCTGATGGTGGTGTTCAAAAACATTGGTCATATTATTACCAAAGCTTTGGCTCTTGGTTCTTCTACTGTTATGATGGGTGGTATGTTGGCCGGTACTACCGAATCACCAGGTGAATATCTCTATCAAGATGGTAAAAGATTGAAGGCGTATCGTGGTATGGGCTCCATTGACGCCATGCAAAAGACTGGTACCAAAGGTAATGCATCTACCTCCCGTTACTTTTCCGAATCAGACAGTGTTTTGGTCGCACAAGGTGTCTCTGGCGCTGTCGTTGACAAAGGATCCATTAAGAAATTTATTCCGTACTTGTACAATGGATTACAACATTCTTGTCAAGACATCGGCTGTAGGTCGTTAACTTTACTAAAGGAAAATGTCCAAAGCGGTAAAGTTAGATTTGAATTCAGAACCGCTTCTGCTCAACTAGAAGGTGGTGTTAATAACTTACATTCCTACGAAAAACGTTTACATAACTGAATGTTAAATGGGATCATTAATACAATAGTACTGTACGTATGGCACCTGTACATACTGCGTTATAAATGTACTAATGGAATGATATATTAATATATAGTGTGTTTATACCTTATTATTGATGATTAGTATATATTTTTATATTTAGGTGATTTTAGTGGAGATTATTTGGTGGTAATTACACTAGTATACATAAAATGGGTAGTGGATATTTGTATAGAAAGGGCATTACGCATGGAGTTAAGAGTATTTACATGATAATTGGGTTCCGTGATTCATTATAGATAATAAAACGTGGATAATATTGGGTGTTATAGGTAAATGGGACAGGGTATAGACCGCTGAGGCAAGTGCCGTGTATGGTGATGTGGTATGGTATCGAGTACCGATGGAGTGAGAGATGGCCTTGGTGTAGAGTATTATGGCGGGTAAGTTAGATGATGTATTGTTTACGTTATATTTGTTTAAATTGGATTTGTTTACATTAGATTTGTTTACATTTCAATATATCAATGGAGGGTATGTAGCATTATGGTAAGTAGCACGTGGTAGATGGGGATTGTAGGTGGATGGTAGGATGAGTGGTAGTGAGAGTTGGATAAGATATATTGGGCAGGGGATAGATGGTTGTTGGGGTGTGGTGATGGATAGTGAGTGGATAGTGAGTGGATGGATGGTGGAGTGGGGGAATGAGACAGGGCATGGGGTGGTGAGGTAAGTGCCGTGGATTGTGATGATGGAGAGGGAGGGTAGTTGACATGGAGTTAGAATTGGGTCAGTGTTAGTGTTAGTGTTAGTATTAGGGTGTGGTGTGTGGGTGTGGTGTGGGTGTGGGTGTGGGTGTGGGTGTGGGTGTGGGTGTGGTGTGGTGTGTGGGTGTGGTGTGGGTGTGGTGTGTGTGGG";

  #
  # Define design parameters (native primer3 syntax)
  #
  my %params = ( 
      PRIMER_NUM_RETURN   => 2,
      PRIMER_SEQUENCE_ID  => $seqID,
      SEQUENCE            => $dna,
      PRIMER_PRODUCT_SIZE_RANGE => '500-600'
  );

my $size_range = join ' ', qw/
      100-300 301-400 401-500 501-600 601-700 701-800 801-900
      901-1000 1001-1200 1201-1400 1401-1600 1601-1800 1801-2000
      2001-2400 2401-2600 2601-2800 2801-3200 3201-3600 3601-4000/;

  #
  # Or use input aliases
  #
  %param = ( 
      num                 => 2,
      id                  => $seqID,
      seq                 => $dna,
      sizerange           => $size_range,
  ); 

  #
  # Design primers
  #
  my $results = $pd->design( %params ) or die "ERROR\n:".$pd->error;

  #
  # Make sure the design was successful
  #
  if ( !$results->left ) {
      die "No primers found\n", $results->raw_data;
  }

  #
  # Get results (single primer set)
  #
  my $left_primer  = $results->left;
  my $right_primer = $results->right;
  my $left_tm      = $results->tmleft;

  #
  # Get results (multiple primer sets)
  #
  my @left_primers  = $results->left(1..3);
  my @right_primers = $results->right(1..3);
  my @left_tms      = $results->tmleft(1..3);