class AddUkrtitleToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :ukrtitle, :string
  end

  def self.down
    remove_column :products, :ukrtitle
  end
end
